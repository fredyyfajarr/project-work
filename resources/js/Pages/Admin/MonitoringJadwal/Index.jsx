import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';

function fileUrl(r) {
    if (!r?.file_jadwal) return null;
    if (String(r.file_jadwal).startsWith('http')) return r.file_jadwal;
    return `/file/jadwal/${r?.idJadwal || r?.id || ''}`;
}

export default function Index({ jadwal = {}, belumUpload = {}, stats = {}, tab = 'terunggah', filters = {} }) {
    const paginatorJadwal = jadwal && typeof jadwal === 'object' ? jadwal : {};
    const paginatorBelum = belumUpload && typeof belumUpload === 'object' ? belumUpload : {};
    
    const rowsJadwal = Array.isArray(paginatorJadwal.data) ? paginatorJadwal.data : [];
    const rowsBelum = Array.isArray(paginatorBelum.data) ? paginatorBelum.data : [];

    const f = useForm({
        search: filters?.search || '',
        semester: filters?.semester || '',
        tab: tab || 'terunggah',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        f.get('/admin/monitoring-jadwal', { preserveState: true });
    };

    const switchTab = (newTab) => {
        f.setData('tab', newTab);
        router.get('/admin/monitoring-jadwal', {
            ...filters,
            tab: newTab,
        }, { preserveState: true });
    };

    const rateKepatuhan = stats?.totalAktif ? Math.round((stats.sudahUpload / stats.totalAktif) * 100) : 0;

    return (
        <AdminLayout title="Monitoring Jadwal & Kepatuhan">
            <PageHeader
                title="Monitoring Jadwal Perkuliahan"
                subtitle="Pantau jadwal kuliah mahasiswa per semester dan tingkat kepatuhan unggah sesuai standar LLD."
            />

            {/* Metrik Statistik Kepatuhan (KAK 8.1.2.a) */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mahasiswa Aktif</div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-slate-800">{stats?.totalAktif ?? 0}</span>
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">Terdaftar</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sudah Unggah</div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-emerald-600">{stats?.sudahUpload ?? 0}</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{rateKepatuhan}% Patuh</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Belum Unggah</div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-rose-600">{stats?.belumUpload ?? 0}</span>
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">Perlu Diingatkan</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total File Jadwal</div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-indigo-600">{stats?.totalFile ?? 0}</span>
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">Dokumen</span>
                    </div>
                </div>
            </div>

            {/* Filter & Pencarian */}
            <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <input
                            value={f.data.search}
                            onChange={(e) => f.setData('search', e.target.value)}
                            placeholder="Cari nama mahasiswa / NIM / judul..."
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            min="1"
                            max="14"
                            value={f.data.semester}
                            onChange={(e) => f.setData('semester', e.target.value)}
                            placeholder="Filter Semester (1-14)"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
                        >
                            <i className="bi bi-search text-xs" />
                            <span>Cari</span>
                        </button>
                        {(filters?.search || filters?.semester) && (
                            <button
                                type="button"
                                onClick={() => router.get('/admin/monitoring-jadwal', { tab: f.data.tab })}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                title="Reset Filter"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Navigasi Tab */}
            <div className="mb-4 flex border-b border-slate-200">
                <button
                    onClick={() => switchTab('terunggah')}
                    className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition cursor-pointer ${tab === 'terunggah' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <i className="bi bi-file-earmark-check-fill" />
                    <span>Daftar File Jadwal Terunggah</span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                        {paginatorJadwal.total ?? rowsJadwal.length}
                    </span>
                </button>
                <button
                    onClick={() => switchTab('kepatuhan')}
                    className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition cursor-pointer ${tab === 'kepatuhan' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <i className="bi bi-exclamation-triangle-fill" />
                    <span>Mahasiswa Belum Mengunggah Jadwal</span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                        {paginatorBelum.total ?? rowsBelum.length}
                    </span>
                </button>
            </div>

            {/* Konten Tab 1: Jadwal Terunggah */}
            {tab === 'terunggah' && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <DataTable
                        searchable={false}
                        paginate={false}
                        data={rowsJadwal}
                        columns={[
                            {
                                label: 'Mahasiswa',
                                render: (r) => (
                                    <div>
                                        <a href={`/admin/mahasiswa/${r?.mahasiswa?.idMahasiswa || r?.idMahasiswa}`} className="font-semibold text-slate-800 hover:text-[#2563eb] transition">
                                            {r?.mahasiswa?.nama || r?.nama || '-'}
                                        </a>
                                        <div className="text-xs text-slate-500">
                                            NIM: {r?.mahasiswa?.nim || r?.nim || '-'} • {r?.mahasiswa?.jurusan || '-'}
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: 'semester',
                                label: 'Semester',
                                className: 'text-center font-bold text-slate-700',
                                render: (r) => `Smtr ${r?.semester ?? '-'}`,
                            },
                            {
                                label: 'Judul Jadwal',
                                render: (r) => (
                                    <div>
                                        <div className="text-xs font-semibold text-slate-800">{r?.judul_jadwal || `Jadwal Semester ${r?.semester ?? '-'}`}</div>
                                        {r?.keterangan && <p className="text-[11px] text-slate-500 line-clamp-1">{r.keterangan}</p>}
                                    </div>
                                ),
                            },
                            {
                                label: 'Tgl Unggah',
                                className: 'text-xs text-slate-500',
                                render: (r) => r?.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-',
                            },
                            {
                                label: 'Unduh File',
                                className: 'text-right',
                                render: (r) => fileUrl(r) ? (
                                    <a
                                        href={fileUrl(r)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Buka / Unduh File Jadwal"
                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563eb] transition hover:bg-blue-100 hover:text-blue-800"
                                    >
                                        <i className="bi bi-file-earmark-arrow-down" />
                                        <span>Buka</span>
                                    </a>
                                ) : '-',
                            },
                        ]}
                        emptyTitle="Belum ada jadwal terunggah"
                        emptyDescription="File jadwal yang diunggah oleh mahasiswa akan tampil di sini."
                    />
                    <Pagination paginator={paginatorJadwal} />
                </div>
            )}

            {/* Konten Tab 2: Mahasiswa Belum Unggah (Kepatuhan Jadwal KAK 8.1.2.a) */}
            {tab === 'kepatuhan' && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800 flex items-center gap-2">
                        <i className="bi bi-info-circle-fill text-amber-600 text-sm" />
                        <span>Daftar berikut menampilkan mahasiswa aktif yang belum memiliki file jadwal kuliah terunggah. Staf LLD dapat menghubungi mahasiswa untuk pendampingan jadwal.</span>
                    </div>

                    <DataTable
                        searchable={false}
                        paginate={false}
                        data={rowsBelum}
                        columns={[
                            {
                                label: 'Mahasiswa',
                                render: (m) => (
                                    <div>
                                        <a href={`/admin/mahasiswa/${m?.idMahasiswa}`} className="font-semibold text-slate-800 hover:text-[#2563eb] transition">
                                            {m?.nama || '-'}
                                        </a>
                                        <div className="text-xs text-slate-500">
                                            NIM: {m?.nim || '-'} • Angkatan {m?.angkatan || '-'}
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: 'jurusan',
                                label: 'Program Studi',
                                render: (m) => <span className="text-xs font-semibold text-slate-700">{m?.jurusan || '-'}</span>,
                            },
                            {
                                label: 'Disabilitas',
                                render: (m) => <Badge status={m?.disabilitas || 'Lainnya'} />,
                            },
                            {
                                label: 'Status Jadwal',
                                render: () => (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                                        <i className="bi bi-x-circle-fill text-[10px]" /> Belum Ada Jadwal
                                    </span>
                                ),
                            },
                            {
                                label: 'Kontak / Aksi',
                                className: 'text-right',
                                render: (m) => (
                                    <div className="flex items-center justify-end gap-1.5">
                                        {m?.noHp ? (
                                            <a
                                                href={`https://wa.me/${String(m.noHp).replace(/^0/, '62').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(m.nama)},%20mohon%20segera%20unggah%20jadwal%20kuliah%20Anda%20di%20Portal%20Mahasiswa%20LLD%20UNPAM.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                                                title="Kirim Pesan WhatsApp"
                                            >
                                                <i className="bi bi-whatsapp" />
                                                <span>WhatsApp</span>
                                            </a>
                                        ) : null}
                                        <a
                                            href={`/admin/mahasiswa/${m?.idMahasiswa}`}
                                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            Detail
                                        </a>
                                    </div>
                                ),
                            },
                        ]}
                        emptyTitle="Semua mahasiswa patuh!"
                        emptyDescription="Seluruh mahasiswa aktif telah mengunggah jadwal kuliah."
                    />
                    <Pagination paginator={paginatorBelum} />
                </div>
            )}
        </AdminLayout>
    );
}

