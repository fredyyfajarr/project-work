import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';
import { route } from '../../../lib/route';
import { confirmAction } from '../../../lib/confirm';

export default function Index({ data = {}, syncInfo = {}, totalMahasiswa = 0, akunMahasiswa = 0 }) {
    const { pendingResetCount = 0 } = usePage().props;
    const paginator = data && typeof data === 'object' ? data : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const links = Array.isArray(paginator.links) ? paginator.links : [];

    const hapus = (id) => {
        confirmAction({
            title: 'Hapus User',
            message: 'Apakah Anda yakin ingin menghapus user ini? Akun ini tidak akan dapat login lagi ke sistem.',
            confirmText: 'Ya, Hapus',
            type: 'danger',
            onConfirm: () => router.delete(route('user.destroy', id)),
        });
    };

    const reset = (id) => {
        confirmAction({
            title: 'Reset Password User',
            message: 'Reset password user ini ke default? Mahasiswa akan kembali ke lld#6digitakhirNIM dan staff ke password default.',
            confirmText: 'Ya, Reset Password',
            type: 'warning',
            onConfirm: () => router.post(`/admin/user/${id}/reset`),
        });
    };

    const sync = () => {
        confirmAction({
            title: 'Sinkronisasi Akun Mahasiswa',
            message: 'Sinkronisasi akan membuatkan akun login secara otomatis untuk seluruh mahasiswa yang belum memiliki akun. Lanjutkan?',
            confirmText: 'Mulai Sinkronisasi',
            type: 'info',
            onConfirm: () => router.post('/admin/user/sync-mahasiswa'),
        });
    };
    return (
        <AdminLayout title="Kelola User">
            <PageHeader
                title="Kelola User"
                subtitle="Kelola akun admin, kabid, kepala lembaga, dan mahasiswa."
                actions={[
                    {
                        label: pendingResetCount > 0 ? `Permohonan Reset (${pendingResetCount})` : 'Permohonan Reset',
                        href: '/admin/permohonan-reset',
                        icon: 'bi-key',
                        variant: pendingResetCount > 0 ? 'warning' : 'secondary',
                    },
                    { label: '+ Tambah User', href: route('user.create') },
                    { label: 'Sinkron Akun Mhs', icon: 'bi-arrow-repeat', variant: 'success', onClick: sync },
                ]}
            />
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm"><h6 className="text-sm text-slate-500">Total Mahasiswa (ber-NIM)</h6><h3 className="text-2xl font-bold">{totalMahasiswa}</h3></div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm"><h6 className="text-sm text-slate-500">Akun Mahasiswa</h6><h3 className="text-2xl font-bold">{akunMahasiswa}</h3></div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm"><h6 className="text-sm text-slate-500">Belum Punya Akun</h6><h3 className="text-2xl font-bold text-yellow-600">{Math.max(0, Number(totalMahasiswa || 0) - Number(akunMahasiswa || 0))}</h3></div>
            </div>
            {(syncInfo?.created || syncInfo?.updated || syncInfo?.skipped) && (
                <p className="mb-3 text-xs text-slate-500">Sinkron terakhir — dibuat: {syncInfo.created ?? 0}, diperbarui: {syncInfo.updated ?? 0}, dilewati: {syncInfo.skipped ?? 0}. <button onClick={sync} className="font-semibold text-[#2563eb]">Jalankan sinkronisasi</button></p>
            )}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <DataTable searchable={false} paginate={false} data={rows} columns={[
                    { key: 'username', label: 'Username / NIM' },
                    { key: 'nama', label: 'Nama', render: (r) => r?.mahasiswa?.nama || r?.nama || '-' },
                    { key: 'email', label: 'Email', render: (r) => r?.email || r?.mahasiswa?.email || <span className="text-slate-400 italic text-xs">-</span> },
                    { key: 'role', label: 'Role', render: (r) => <Badge status={String(r?.role || '-').replace(/_/g, ' ')} /> },
                    { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || 'aktif'} /> },
                    { label: 'Aksi', render: (r) => (
                        <div className="flex items-center gap-1">
                            <Link href={route('user.edit', r?.idUser || r?.id)} title="Edit User" className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition">
                                <i className="bi bi-pencil-square text-base leading-none" />
                            </Link>
                            <button onClick={() => reset(r?.idUser || r?.id)} title="Reset Password" className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer">
                                <i className="bi bi-key text-base leading-none" />
                            </button>
                            <button onClick={() => hapus(r?.idUser || r?.id)} title="Hapus User" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer">
                                <i className="bi bi-trash text-base leading-none" />
                            </button>
                        </div>
                    ) },
                ]} emptyTitle="Belum ada user" />
                <Pagination paginator={paginator} />
                <p className="mt-2 text-xs text-slate-500">Username mahasiswa memakai NIM; password default memakai format lld#6digitakhirNIM.</p>
            </div>
        </AdminLayout>
    );
}
