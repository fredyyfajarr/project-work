import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';
import { route } from '../../../lib/route';
import { confirmAction } from '../../../lib/confirm';

export default function Index({ data = {}, jurusan = [], filters = {} }) {
    const paginator = data && typeof data === 'object' ? data : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const links = Array.isArray(paginator.links) ? paginator.links : [];
    const jurusanList = Array.isArray(jurusan) ? jurusan : [];
    const f = useForm({ jurusan: filters?.jurusan || '', disabilitas: filters?.disabilitas || '', search: filters?.search || '' });

    const destroy = (id) => {
        confirmAction({
            title: 'Hapus Data Mahasiswa',
            message: 'Yakin hapus data ini? Semua data akademik, keluarga, luaran, jadwal, aspirasi, dan akun login mahasiswa akan ikut dihapus secara permanen.',
            confirmText: 'Ya, Hapus Data',
            type: 'danger',
            onConfirm: () => router.delete(route('mahasiswa.destroy', id)),
        });
    };
    return (
        <AdminLayout title="Database Master">
            <PageHeader title="Database Master" subtitle="Kelola seluruh profil dan berkas digital mahasiswa." actions={[
                { label: '+ Tambah Baru', href: route('mahasiswa.create') },
                { label: 'Preview Import', href: route('mahasiswa.preview'), variant: 'secondary', icon: 'bi-upload' },
            ]} />
            <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm md:p-5">
                <form onSubmit={(e) => { e.preventDefault(); f.get(route('mahasiswa.index')); }} className="grid gap-2 md:grid-cols-4">
                    <input value={f.data.search} onChange={(e) => f.setData('search', e.target.value)} placeholder="Cari nama / NIM" className="rounded-xl border px-3 py-2.5 text-sm" />
                    <select value={f.data.jurusan} onChange={(e) => f.setData('jurusan', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Jurusan</option>
                        {jurusanList.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <select value={f.data.disabilitas} onChange={(e) => f.setData('disabilitas', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Disabilitas</option>
                        {['Netra', 'Rungu', 'Daksa', 'Grahita', 'Lainnya'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white"><i className="bi bi-search mr-1" />Cari</button>
                </form>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
                <DataTable
                    searchable={false}
                    paginate={false}
                    data={rows}
                    columns={[
                        { key: 'nama', label: 'Nama / NIM', render: (m) => (<div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-[#2563eb]">{String(m?.nama || '?').slice(0, 1).toUpperCase()}</div><div><div className="font-bold">{m?.nama}</div><small className="text-slate-500">{m?.nim}</small></div></div>) },
                        { key: 'jurusan', label: 'Program Studi', render: (m) => (<span>{m?.jurusan || '-'}<br /><small className="text-slate-500">Semester {m?.semester ?? m?.akademikTerbaru?.semester ?? '-'}</small></span>) },
                        { key: 'disabilitas', label: 'Disabilitas' },
                        { key: 'jalurMasuk', label: 'Beasiswa', render: (m) => m?.jalurMasuk || '-' },
                        { key: 'status', label: 'Status', className: 'text-center', render: (m) => <Badge status={m?.status || '-'} /> },
                        { label: 'Aksi', className: 'text-center', render: (m) => (
                            <div className="flex items-center justify-center gap-1">
                                <Link href={route('mahasiswa.detail', m?.idMahasiswa)} title="Lihat Detail" className="rounded-lg p-1.5 text-[#2563eb] hover:bg-blue-50 hover:text-blue-700 transition">
                                    <i className="bi bi-eye text-base leading-none" />
                                </Link>
                                <Link href={route('mahasiswa.edit', m?.idMahasiswa)} title="Edit Data" className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition">
                                    <i className="bi bi-pencil-square text-base leading-none" />
                                </Link>
                                <button onClick={() => destroy(m?.idMahasiswa)} title="Hapus Data" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer">
                                    <i className="bi bi-trash text-base leading-none" />
                                </button>
                            </div>
                        ) },
                    ]}
                />
                <Pagination paginator={paginator} />
            </div>
        </AdminLayout>
    );
}
