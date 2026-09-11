import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Badge from '../../../Components/Badge';
import Modal from '../../../Components/Modal';

export default function Index({ data, stats = {}, filters = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const rows = data?.data || [];

    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [search, setSearch] = useState(filters.search || '');
    const [verifyModal, setVerifyModal] = useState({ open: false, item: null, status: 'Disetujui', catatan: '' });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/beasiswa', { status: filterStatus, search }, { preserveState: true, replace: true });
    };

    const handleVerifySubmit = (e) => {
        e.preventDefault();
        if (!verifyModal.item) return;
        router.post(`/admin/beasiswa/verifikasi/${verifyModal.item.idBeasiswa}`, {
            status: verifyModal.status,
            catatan: verifyModal.catatan,
        }, {
            onSuccess: () => setVerifyModal({ open: false, item: null, status: 'Disetujui', catatan: '' }),
        });
    };

    const columns = [
        {
            label: 'Mahasiswa',
            render: (it) => (
                <div>
                    <div className="font-semibold text-slate-800">{it.mahasiswa?.nama || '-'}</div>
                    <div className="text-xs text-slate-500">NIM: {it.mahasiswa?.nim || '-'} • {it.mahasiswa?.jurusan || '-'}</div>
                    <div className="mt-0.5 text-xs text-blue-600 font-medium">{it.mahasiswa?.disabilitas || '-'}</div>
                </div>
            ),
        },
        {
            label: 'Informasi Rekening',
            render: (it) => (
                <div>
                    <div className="font-semibold text-slate-800">{it.namaBank} — {it.noRekening}</div>
                    <div className="text-xs text-slate-500">a.n. {it.atasNama}</div>
                    <div className="text-xs text-slate-400 mt-0.5">NIK: {it.nikKtp || it.mahasiswa?.nik || '-'}</div>
                </div>
            ),
        },
        {
            label: 'Buku Tabungan',
            render: (it) => it.fileBukuTabungan ? (
                <a
                    href={`/storage/${it.fileBukuTabungan}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563eb] hover:bg-blue-100 transition"
                >
                    <i className="bi bi-file-earmark-pdf" />
                    <span>Lihat Berkas</span>
                </a>
            ) : (
                <span className="text-xs text-slate-400">Belum Unggah</span>
            ),
        },
        {
            label: 'Status',
            render: (it) => (
                <div>
                    <Badge status={it.status} />
                    {it.catatan && <p className="mt-1 text-[11px] text-slate-500 max-w-xs">{it.catatan}</p>}
                </div>
            ),
        },
        {
            label: 'Aksi',
            className: 'text-right',
            render: (it) => (
                <button
                    onClick={() => setVerifyModal({ open: true, item: it, status: it.status === 'Disetujui' ? 'Disetujui' : 'Disetujui', catatan: it.catatan || '' })}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#2563eb] hover:text-white transition cursor-pointer"
                >
                    <i className="bi bi-shield-check" />
                    <span>Verifikasi</span>
                </button>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola & Monitoring Beasiswa">
            {/* Kartu Statistik */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500">Total Pengajuan</div>
                    <div className="mt-1 text-2xl font-bold text-slate-800">{stats.total || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-amber-600">Menunggu Verifikasi</div>
                    <div className="mt-1 text-2xl font-bold text-amber-600">{stats.menunggu || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-emerald-600">Disetujui</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-600">{stats.disetujui || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-rose-600">Ditolak</div>
                    <div className="mt-1 text-2xl font-bold text-rose-600">{stats.ditolak || 0}</div>
                </div>
            </div>

            {/* Filter & Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2.5">
                        <input
                            type="text"
                            placeholder="Cari mahasiswa / no rek..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#2563eb]"
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#2563eb]"
                        >
                            <option value="">Semua Status</option>
                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Ditolak">Ditolak</option>
                        </select>
                        <button type="submit" className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700">
                            Filter
                        </button>
                    </form>

                    <a
                        href={`/admin/beasiswa/export${filterStatus ? `?status=${filterStatus}` : ''}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        <i className="bi bi-file-earmark-excel text-emerald-600 text-sm" />
                        <span>Export Excel (CSV)</span>
                    </a>
                </div>

                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={data}
                    searchable={false}
                    emptyTitle="Tidak ada data beasiswa"
                    emptyDescription="Belum ada data pengajuan beasiswa atau rekening yang sesuai."
                />
            </div>

            {/* Modal Verifikasi */}
            {verifyModal.open && (
                <Modal open={verifyModal.open} onClose={() => setVerifyModal({ open: false, item: null, status: 'Disetujui', catatan: '' })} title="Verifikasi Data Beasiswa">
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <div className="rounded-xl bg-slate-50 p-3.5 text-xs">
                            <div className="font-bold text-slate-800">{verifyModal.item?.mahasiswa?.nama} ({verifyModal.item?.mahasiswa?.nim})</div>
                            <div className="text-slate-500 mt-0.5">{verifyModal.item?.namaBank} — {verifyModal.item?.noRekening} (a.n. {verifyModal.item?.atasNama})</div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Status Verifikasi</label>
                            <select
                                value={verifyModal.status}
                                onChange={(e) => setVerifyModal({ ...verifyModal, status: e.target.value })}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#2563eb]"
                            >
                                <option value="Disetujui">Disetujui (Data Rekening Valid)</option>
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Ditolak">Ditolak (Data Tidak Sesuai)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Catatan untuk Mahasiswa (Opsional)</label>
                            <textarea
                                value={verifyModal.catatan}
                                onChange={(e) => setVerifyModal({ ...verifyModal, catatan: e.target.value })}
                                placeholder="Contoh: Nomor rekening berhasil diverifikasi atau mohon unggah ulang buku tabungan yang lebih jelas."
                                rows="3"
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#2563eb]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setVerifyModal({ open: false, item: null, status: 'Disetujui', catatan: '' })}
                                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="rounded-xl bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                Simpan Status
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}