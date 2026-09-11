import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';

export default function Index({ aspirasi = {}, filters = {} }) {
    const paginator = aspirasi && typeof aspirasi === 'object' ? aspirasi : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const f = useForm({ search: filters?.search || '', kategori: filters?.kategori || '' });

    // State modal tindak lanjut
    const [selectedAspirasi, setSelectedAspirasi] = useState(null);
    const respondForm = useForm({
        status: 'Diproses',
        tanggapan: '',
    });

    const openModal = (item) => {
        setSelectedAspirasi(item);
        respondForm.setData({
            status: item?.status === 'Diajukan' || item?.status === 'Dikirim' ? 'Diproses' : (item?.status || 'Diproses'),
            tanggapan: item?.tanggapan || '',
        });
    };

    const submitResponse = (e) => {
        e.preventDefault();
        if (!selectedAspirasi) return;

        respondForm.post(`/admin/monitoring-aspirasi/${selectedAspirasi.id}/tanggapi`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedAspirasi(null);
                respondForm.reset();
            },
        });
    };

    return (
        <AdminLayout title="Monitoring Aspirasi">
            <PageHeader
                title="Monitoring Aspirasi Mahasiswa & Alumni"
                subtitle="Pantau dan berikan tindak lanjut resmi terhadap aspirasi, kebutuhan layanan, atau kendala yang disampaikan mahasiswa."
            />

            <div className="mb-4 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-white/10">
                <form onSubmit={(e) => { e.preventDefault(); f.get('/admin/monitoring-aspirasi'); }} className="grid gap-2 md:grid-cols-4">
                    <input
                        value={f.data.search}
                        onChange={(e) => f.setData('search', e.target.value)}
                        placeholder="Cari nama, NIM, subjek, isi aspirasi"
                        className="rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm dark:text-white md:col-span-2 outline-none focus:border-[#2196f3]"
                    />
                    <select
                        value={f.data.kategori}
                        onChange={(e) => f.setData('kategori', e.target.value)}
                        className="rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm dark:text-white outline-none focus:border-[#2196f3]"
                    >
                        <option value="">Semua Kategori</option>
                        {['Akademik', 'Fasilitas', 'Layanan Disabilitas', 'Lainnya'].map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <button className="rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer">
                        <i className="bi bi-search mr-1" /> Cari
                    </button>
                </form>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-white/10">
                <DataTable
                    searchable={false}
                    paginate={false}
                    data={rows}
                    columns={[
                        {
                            label: 'Mahasiswa / Pengirim',
                            render: (r) => (
                                <div>
                                    <div className="font-bold text-slate-800 dark:text-white">{r?.mahasiswa?.nama || r?.nama || '-'}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{r?.mahasiswa?.nim || r?.nim || '-'} • {r?.mahasiswa?.jurusan || '-'}</div>
                                </div>
                            ),
                        },
                        {
                            label: 'Aspirasi',
                            render: (r) => (
                                <div>
                                    <span className="inline-block rounded-md bg-blue-50 dark:bg-sky-500/20 px-2 py-0.5 text-[11px] font-bold text-[#1976d2] dark:text-sky-300 mb-1">
                                        {r?.kategori || 'Umum'}
                                    </span>
                                    <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{r?.subjek}</div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{r?.pesan}</p>
                                    {r?.tanggapan && (
                                        <div className="mt-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-2 text-xs text-emerald-800 dark:text-emerald-300">
                                            <strong>Tanggapan LLD:</strong> {r.tanggapan}
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: 'tanggal',
                            label: 'Tanggal',
                            render: (r) => <span className="text-xs text-slate-500 dark:text-slate-400">{r?.tanggal || r?.created_at?.slice(0, 10) || '-'}</span>,
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            render: (r) => <Badge status={r?.status || 'dikirim'} />,
                        },
                        {
                            label: 'Aksi',
                            className: 'text-right',
                            render: (r) => (
                                <button
                                    onClick={() => openModal(r)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1976d2] dark:bg-sky-500/20 dark:hover:bg-sky-500/30 dark:text-sky-300 border border-sky-200 dark:border-sky-400/30 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                                    title="Berikan Tanggapan / Update Status"
                                >
                                    <i className="bi bi-chat-dots-fill" />
                                    <span>Tanggapi</span>
                                </button>
                            ),
                        },
                    ]}
                    emptyTitle="Belum ada aspirasi"
                />
                <Pagination paginator={paginator} />
            </div>

            {/* Modal Tanggapan & Tindak Lanjut Aspirasi (KAK 8.1.2.b) */}
            {selectedAspirasi && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setSelectedAspirasi(null)}
                    />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 border border-slate-100 dark:border-white/10 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <i className="bi bi-chat-square-text-fill text-[#2196f3] text-xl" />
                                <h3 className="text-base font-bold text-slate-800 dark:text-white">Tindak Lanjut Aspirasi</h3>
                            </div>
                            <button
                                onClick={() => setSelectedAspirasi(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition cursor-pointer"
                            >
                                <i className="bi bi-x-lg text-base leading-none" />
                            </button>
                        </div>

                        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs border border-slate-200 dark:border-white/10">
                            <div className="font-bold text-slate-800 dark:text-white">
                                {selectedAspirasi?.mahasiswa?.nama || selectedAspirasi?.nama || '-'} ({selectedAspirasi?.mahasiswa?.nim || '-'})
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                                Subjek: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedAspirasi?.subjek}</span>
                            </div>
                            <p className="mt-1.5 text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-white/5">
                                "{selectedAspirasi?.pesan}"
                            </p>
                        </div>

                        <form onSubmit={submitResponse} className="mt-4 space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Status Penanganan Aspirasi
                                </label>
                                <select
                                    value={respondForm.data.status}
                                    onChange={(e) => respondForm.setData('status', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm dark:text-white outline-none focus:border-[#2196f3]"
                                >
                                    <option value="Diajukan">Diajukan / Baru</option>
                                    <option value="Diproses">Diproses (Sedang Ditindaklanjuti LLD)</option>
                                    <option value="Selesai">Selesai (Sudah Diberikan Solusi / Selesai)</option>
                                    <option value="Ditolak">Ditolak (Tidak Dapat Diproses)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Tanggapan dari LLD (Akan Dilihat Mahasiswa)
                                </label>
                                <textarea
                                    value={respondForm.data.tanggapan}
                                    onChange={(e) => respondForm.setData('tanggapan', e.target.value)}
                                    rows="4"
                                    placeholder="Tuliskan respon, solusi, atau penjelasan tindak lanjut dari pihak LLD..."
                                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-950 p-3 text-sm dark:text-white outline-none focus:border-[#2196f3]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setSelectedAspirasi(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={respondForm.processing}
                                    className="rounded-xl bg-[#2196f3] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1976d2] transition disabled:opacity-50 cursor-pointer"
                                >
                                    {respondForm.processing ? 'Menyimpan...' : 'Simpan Tanggapan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
