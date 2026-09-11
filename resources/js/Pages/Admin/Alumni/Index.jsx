import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Badge from '../../../Components/Badge';

export default function Index({ data, stats = {}, filters = {}, jurusanList = [] }) {
    const rows = data?.data || [];
    const [search, setSearch] = useState(filters.search || '');
    const [jurusan, setJurusan] = useState(filters.jurusan || '');
    const [statusPekerjaan, setStatusPekerjaan] = useState(filters.statusPekerjaan || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/alumni', { search, jurusan, statusPekerjaan }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            label: 'Alumni',
            render: (it) => (
                <div>
                    <div className="font-semibold text-slate-800">{it.nama || '-'}</div>
                    <div className="text-xs text-slate-500">NIM: {it.nim} • {it.jurusan}</div>
                    <div className="mt-0.5 text-xs text-blue-600 font-medium">{it.disabilitas}</div>
                </div>
            ),
        },
        {
            label: 'Status Tracer Study',
            render: (it) => {
                const t = it.tracerTerbaru;
                if (!t) return <Badge status="Belum Mengisi" />;
                return (
                    <div>
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            {t.statusPekerjaan}
                        </span>
                        {t.namaInstansi && (
                            <div className="text-xs text-slate-700 font-medium mt-1">
                                {t.namaInstansi} {t.jabatan ? `(${t.jabatan})` : ''}
                            </div>
                        )}
                        {t.kesesuaianBidang && (
                            <div className="text-[11px] text-slate-500">
                                Kesesuaian: <span className="font-medium text-slate-700">{t.kesesuaianBidang}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            label: 'Masa Tunggu',
            render: (it) => {
                const t = it.tracerTerbaru;
                if (!t || t.masaTungguBulan === null) return <span className="text-xs text-slate-400">-</span>;
                return <span className="text-xs font-semibold text-slate-700">{t.masaTungguBulan} Bulan</span>;
            },
        },
        {
            label: 'Kontak',
            render: (it) => (
                <div className="text-xs text-slate-600">
                    <div>{it.noHp || '-'}</div>
                    <div className="text-slate-400">{it.email || '-'}</div>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Monitoring Alumni & Tracer Study">
            {/* Visual Kartu Statistik */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mb-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500">Total Alumni Lulus</div>
                    <div className="mt-1 text-2xl font-bold text-slate-800">{stats.totalLulus || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-blue-600">Bekerja</div>
                    <div className="mt-1 text-2xl font-bold text-blue-600">{stats.bekerja || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-emerald-600">Wirausaha</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-600">{stats.wirausaha || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-indigo-600">Studi Lanjut</div>
                    <div className="mt-1 text-2xl font-bold text-indigo-600">{stats.studiLanjut || 0}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-amber-600">Belum Bekerja</div>
                    <div className="mt-1 text-2xl font-bold text-amber-600">{stats.belumBekerja || 0}</div>
                </div>
            </div>

            {/* Filter & Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2.5">
                        <input
                            type="text"
                            placeholder="Cari nama / NIM..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#2563eb]"
                        />
                        <select
                            value={jurusan}
                            onChange={(e) => setJurusan(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#2563eb]"
                        >
                            <option value="">Semua Program Studi</option>
                            {jurusanList.map((j) => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                        <select
                            value={statusPekerjaan}
                            onChange={(e) => setStatusPekerjaan(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#2563eb]"
                        >
                            <option value="">Semua Status Kerja</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Wirausaha">Wirausaha</option>
                            <option value="Melanjutkan Studi">Melanjutkan Studi</option>
                            <option value="Belum Bekerja">Belum Bekerja</option>
                        </select>
                        <button type="submit" className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700">
                            Filter
                        </button>
                    </form>

                    <a
                        href={`/admin/alumni/export${jurusan ? `?jurusan=${jurusan}` : ''}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        <i className="bi bi-file-earmark-excel text-emerald-600 text-sm" />
                        <span>Export Data Tracer (CSV)</span>
                    </a>
                </div>

                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={data}
                    searchable={false}
                    emptyTitle="Tidak ada data alumni"
                    emptyDescription="Belum ada data mahasiswa dengan status lulus atau hasil pencarian tidak ditemukan."
                />
            </div>
        </AdminLayout>
    );
}