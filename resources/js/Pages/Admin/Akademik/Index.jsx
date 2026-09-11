import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';
import { route } from '../../../lib/route';

function latestAkademik(m) {
    const direct = m?.akademik_terbaru || m?.akademikTerbaru || null;
    if (direct && typeof direct === 'object') return direct;
    return {};
}

export default function Index({ mahasiswa = {}, filters = {} }) {
    const paginator = mahasiswa && typeof mahasiswa === 'object' ? mahasiswa : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const f = useForm({ search: filters?.search || '' });
    const [showImportModal, setShowImportModal] = useState(false);
    const importForm = useForm({ file: null });

    const handleImportSubmit = (e) => {
        e.preventDefault();
        importForm.post(route('admin.akademik.preview'), {
            forceFormData: true,
            onSuccess: () => setShowImportModal(false),
        });
    };

    return (
        <AdminLayout title="Kelola Akademik">
            <PageHeader
                title="Kelola Akademik"
                subtitle="Kelola data IPS/IPK mahasiswa per semester."
                actions={[
                    { label: 'Download Template', href: '/template_akademik.xlsx', icon: 'bi-download', variant: 'secondary' },
                    { label: 'Import Excel', icon: 'bi-upload', variant: 'success', onClick: () => setShowImportModal(true) },
                ]}
            />

            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <form onSubmit={(e) => { e.preventDefault(); f.get(route('akademik.index')); }} className="flex gap-2">
                    <input
                        value={f.data.search}
                        onChange={(e) => f.setData('search', e.target.value)}
                        placeholder="Cari nama / NIM"
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]"
                    />
                    <button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white cursor-pointer transition hover:bg-blue-700">
                        <i className="bi bi-search mr-1.5" />Cari
                    </button>
                </form>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <DataTable
                    searchable={false}
                    paginate={false}
                    data={rows}
                    columns={[
                        { key: 'nim', label: 'NIM' },
                        { key: 'nama', label: 'Nama' },
                        { key: 'jurusan', label: 'Jurusan', render: (r) => r?.jurusan || '-' },
                        { label: 'Semester Terakhir', render: (r) => latestAkademik(r)?.semester ?? '-' },
                        { label: 'IPK Terakhir', render: (r) => latestAkademik(r)?.ipk ?? '-' },
                        { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || '-'} /> },
                        {
                            label: 'Aksi',
                            render: (m) => (
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/mahasiswa/${m?.idMahasiswa}`}
                                        title="Lihat Detail Mahasiswa"
                                        className="rounded-lg p-1.5 text-[#2563eb] hover:bg-blue-50 hover:text-blue-700 transition"
                                    >
                                        <i className="bi bi-eye text-base leading-none" />
                                    </Link>
                                    <Link
                                        href={route('akademik.show', m?.idMahasiswa)}
                                        title="Kelola Nilai & Riwayat"
                                        className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition"
                                    >
                                        <i className="bi bi-pencil-square text-base leading-none" />
                                    </Link>
                                </div>
                            ),
                        },
                    ]}
                />
                <Pagination paginator={paginator} />
            </div>

            {/* Modal Import Excel */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h4 className="font-bold text-slate-800">Import Data Akademik</h4>
                            <button
                                type="button"
                                onClick={() => setShowImportModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>
                        <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Upload File Excel (.xlsx / .xls)
                                </label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    required
                                    onChange={(e) => importForm.setData('file', e.target.files[0])}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                                />
                                {importForm.errors.file && (
                                    <p className="mt-1 text-xs text-red-600">{importForm.errors.file}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <a
                                    href="/template_akademik.xlsx"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline"
                                >
                                    <i className="bi bi-download" />
                                    Download Template
                                </a>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowImportModal(false)}
                                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={importForm.processing}
                                        className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                    >
                                        {importForm.processing ? 'Mengunggah...' : 'Upload & Preview'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
