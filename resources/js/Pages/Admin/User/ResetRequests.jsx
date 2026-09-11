import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';
import { confirmAction } from '../../../lib/confirm';

export default function ResetRequests({ requests = {}, pendingCount = 0 }) {
    const paginator = requests && typeof requests === 'object' ? requests : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const [copiedId, setCopiedId] = useState(null);

    const approve = (req) => {
        confirmAction({
            title: 'Setujui (ACC) Reset Password',
            message: `Apakah Anda yakin ingin menyetujui permohonan reset password untuk pengguna "${req.username}"? Tautan reset akan otomatis dibuat dan berlaku selama 24 jam.`,
            confirmText: 'Ya, Setujui (ACC)',
            type: 'info',
            onConfirm: () => router.post(`/admin/permohonan-reset/${req.id}/approve`),
        });
    };

    const reject = (req) => {
        confirmAction({
            title: 'Tolak Permohonan Reset',
            message: `Apakah Anda yakin ingin menolak permohonan reset password untuk pengguna "${req.username}"?`,
            confirmText: 'Ya, Tolak Permohonan',
            type: 'danger',
            onConfirm: () => router.post(`/admin/permohonan-reset/${req.id}/reject`),
        });
    };

    const copyLink = (req) => {
        if (!req.token) return;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/reset-password/${req.token}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(req.id);
            setTimeout(() => setCopiedId(null), 3000);
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200"><i className="bi bi-clock-history" /> Menunggu ACC</span>;
            case 'approved':
                return <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-[#1976d2] border border-sky-200"><i className="bi bi-check-circle" /> Disetujui (ACC)</span>;
            case 'completed':
                return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200"><i className="bi bi-patch-check" /> Berhasil Direset</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200"><i className="bi bi-x-circle" /> Ditolak</span>;
            default:
                return <Badge status={status} />;
        }
    };

    return (
        <AdminLayout title="Permohonan Reset Password">
            <PageHeader
                title="Permohonan Reset Password"
                subtitle="Daftar permintaan lupa kata sandi dari mahasiswa & pengguna yang membutuhkan persetujuan (ACC) Admin."
                actions={[
                    { label: 'Kelola User', href: '/admin/user', variant: 'secondary', icon: 'bi-people' },
                ]}
            />

            {/* Statistik Singkat */}
            <div className="mb-5 grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 text-center shadow-xs border border-slate-100">
                    <h6 className="text-xs font-medium text-slate-500">Menunggu ACC</h6>
                    <h3 className={`text-2xl font-black mt-1 ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>{pendingCount}</h3>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-xs border border-slate-100">
                    <h6 className="text-xs font-medium text-slate-500">Total Permohonan</h6>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">{paginator.total || rows.length}</h3>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-xs border border-slate-100">
                    <h6 className="text-xs font-medium text-slate-500">Disetujui</h6>
                    <h3 className="text-2xl font-black text-[#2196f3] mt-1">
                        {rows.filter(r => r.status === 'approved').length}
                    </h3>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-xs border border-slate-100">
                    <h6 className="text-xs font-medium text-slate-500">Selesai Direset</h6>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">
                        {rows.filter(r => r.status === 'completed').length}
                    </h3>
                </div>
            </div>

            {/* Info Alur */}
            <div className="mb-4 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 p-4 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                    <i className="bi bi-info-circle-fill text-[#2196f3] text-base shrink-0 mt-0.5" />
                    <div>
                        <strong className="text-slate-800">Alur Persetujuan Reset Kata Sandi:</strong>
                        <p className="mt-0.5 text-slate-600 leading-relaxed">
                            Ketika pengguna mengajukan lupa kata sandi dengan username & email terdaftar, permohonan akan berstatus <strong>Menunggu ACC</strong>. 
                            Klik tombol <strong>ACC / Setujui</strong> untuk mengizinkan reset password, lalu salin tautan reset yang dihasilkan dan kirimkan ke pengguna (atau pengguna dapat langsung membuka tautan tersebut).
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabel Permohonan */}
            <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xs border border-slate-100">
                <DataTable
                    searchable={false}
                    paginate={false}
                    data={rows}
                    columns={[
                        {
                            key: 'username',
                            label: 'Pengguna / Akun',
                            render: (r) => (
                                <div>
                                    <div className="font-bold text-slate-800">{r.username}</div>
                                    <div className="text-xs text-slate-500">
                                        {r.user?.mahasiswa?.nama || (r.user?.role ? String(r.user.role).replace(/_/g, ' ').toUpperCase() : '-')}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'email',
                            label: 'Email Terdaftar',
                            render: (r) => (
                                <div className="text-xs font-medium text-slate-600">
                                    <i className="bi bi-envelope mr-1 text-slate-400" />
                                    {r.email}
                                </div>
                            ),
                        },
                        {
                            key: 'created_at',
                            label: 'Waktu Pengajuan',
                            render: (r) => (
                                <div className="text-xs text-slate-500">
                                    {r.created_at ? new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                                </div>
                            ),
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            render: (r) => getStatusBadge(r.status),
                        },
                        {
                            label: 'Keterangan',
                            render: (r) => (
                                <div className="text-xs text-slate-500 max-w-[200px] truncate">
                                    {r.admin_notes || (r.approver ? `Di-ACC oleh ${r.approver.username}` : '-')}
                                </div>
                            ),
                        },
                        {
                            label: 'Aksi',
                            render: (r) => (
                                <div className="flex items-center gap-1.5">
                                    {r.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => approve(r)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-[#2196f3] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1976d2] transition cursor-pointer"
                                                title="Setujui dan buatkan tautan reset"
                                            >
                                                <i className="bi bi-check-lg" />
                                                <span>ACC</span>
                                            </button>
                                            <button
                                                onClick={() => reject(r)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                                title="Tolak permohonan"
                                            >
                                                <i className="bi bi-x-lg" />
                                                <span>Tolak</span>
                                            </button>
                                        </>
                                    )}

                                    {r.status === 'approved' && r.token && (
                                        <button
                                            onClick={() => copyLink(r)}
                                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                copiedId === r.id
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-sky-50 text-[#1976d2] hover:bg-sky-100 border border-sky-200'
                                            }`}
                                            title="Salin Tautan Reset Password"
                                        >
                                            <i className={`bi ${copiedId === r.id ? 'bi-check-all' : 'bi-link-45deg'} text-sm`} />
                                            <span>{copiedId === r.id ? 'Tersalin!' : 'Salin Tautan'}</span>
                                        </button>
                                    )}

                                    {r.status === 'completed' && (
                                        <span className="text-xs text-slate-400 italic">Selesai</span>
                                    )}

                                    {r.status === 'rejected' && (
                                        <span className="text-xs text-rose-400 italic">Ditolak</span>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    emptyTitle="Belum ada permohonan reset kata sandi"
                />
                <Pagination paginator={paginator} />
            </div>
        </AdminLayout>
    );
}
