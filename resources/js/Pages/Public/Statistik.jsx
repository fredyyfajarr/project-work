import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { route } from '../../lib/route';

function toCards(cards) {
    if (Array.isArray(cards)) return cards;
    if (cards && typeof cards === 'object') return Object.values(cards);
    return [];
}

export default function Statistik({ statistik = {} }) {
    const s = statistik || {};
    const cards = toCards(s.cards);
    const ringkasan = s.ringkasan || {};
    const status = Array.isArray(s.status) ? s.status : [];
    const disabilitas = Array.isArray(s.disabilitas) ? s.disabilitas : [];
    const jurusan = Array.isArray(s.jurusan) ? s.jurusan : [];
    const angkatan = Array.isArray(s.angkatan) ? s.angkatan : [];
    const akademik = s.akademik || {};

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-6xl space-y-10">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Statistik Terintegrasi Realtime
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Statistik Lengkap LLD UNPAM
                        </h1>
                        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            Data berikut terhubung langsung dengan database master LLD, menyajikan perkembangan terkini mahasiswa dan luaran akademik secara transparan dan akurat.
                        </p>
                    </div>

                    {/* Summary Top Metric Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {cards.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-200/80 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md"
                            >
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1976d2] dark:text-sky-400 font-mono">
                                    {stat?.value ?? 0}
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 uppercase tracking-wider text-center">
                                    {stat?.label ?? '-'}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Detail Grid: Status & Disabilitas */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Status Mahasiswa */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md space-y-5 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i className="bi bi-person-lines-fill text-[#2196f3]" />
                                <span>Status Mahasiswa</span>
                            </h3>

                            <div className="grid grid-cols-5 gap-2 text-center">
                                {[
                                    { label: 'Total', val: ringkasan.total },
                                    { label: 'Aktif', val: ringkasan.aktif },
                                    { label: 'Lulus', val: ringkasan.lulus },
                                    { label: 'Cuti', val: ringkasan.cuti },
                                    { label: 'Nonaktif', val: ringkasan.nonaktif },
                                ].map((it) => (
                                    <div key={it.label} className="p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 dark:bg-white/5 dark:border-white/10">
                                        <div className="text-base sm:text-lg font-bold text-[#1976d2] dark:text-sky-400 font-mono">{it.val ?? 0}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">{it.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/80">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f8fafc] text-[#1976d2] uppercase tracking-wider border-b border-slate-200 font-bold dark:bg-slate-800/80 dark:text-sky-300 dark:border-white/10">
                                        <tr>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Total Mahasiswa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-200">
                                        {status.length === 0 ? (
                                            <tr><td colSpan="2" className="p-4 text-center text-slate-400">Belum ada data status.</td></tr>
                                        ) : (
                                            status.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                                                    <td className="p-3 font-medium">{row?.label ?? '-'}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-[#2196f3] dark:text-sky-400">{row?.total ?? 0}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Jenis Disabilitas */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md space-y-5 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i className="bi bi-universal-access text-[#2196f3]" />
                                <span>Jenis Disabilitas</span>
                            </h3>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                {[
                                    { label: 'Netra', val: ringkasan.netra },
                                    { label: 'Rungu', val: ringkasan.rungu },
                                    { label: 'Daksa', val: ringkasan.daksa },
                                ].map((it) => (
                                    <div key={it.label} className="p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 dark:bg-white/5 dark:border-white/10">
                                        <div className="text-base sm:text-lg font-bold text-[#1976d2] dark:text-sky-400 font-mono">{it.val ?? 0}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">{it.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/80">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f8fafc] text-[#1976d2] uppercase tracking-wider border-b border-slate-200 font-bold dark:bg-slate-800/80 dark:text-sky-300 dark:border-white/10">
                                        <tr>
                                            <th className="p-3">Kategori Disabilitas</th>
                                            <th className="p-3 text-right">Total Mahasiswa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-200">
                                        {disabilitas.length === 0 ? (
                                            <tr><td colSpan="2" className="p-4 text-center text-slate-400">Belum ada data ragam disabilitas.</td></tr>
                                        ) : (
                                            disabilitas.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                                                    <td className="p-3 font-medium">{row?.label ?? '-'}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-[#2196f3] dark:text-sky-400">{row?.total ?? 0}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Detail Grid: Program Studi & Angkatan */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Program Studi */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md space-y-4 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i className="bi bi-mortarboard-fill text-[#2196f3]" />
                                <span>Persebaran Program Studi</span>
                            </h3>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/80">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f8fafc] text-[#1976d2] uppercase tracking-wider border-b border-slate-200 font-bold dark:bg-slate-800/80 dark:text-sky-300 dark:border-white/10">
                                        <tr>
                                            <th className="p-3">Program Studi</th>
                                            <th className="p-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-200">
                                        {jurusan.length === 0 ? (
                                            <tr><td colSpan="2" className="p-4 text-center text-slate-400">Belum ada data program studi.</td></tr>
                                        ) : (
                                            jurusan.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                                                    <td className="p-3 font-medium">{row?.label ?? '-'}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-[#2196f3] dark:text-sky-400">{row?.total ?? 0}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Angkatan */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md space-y-4 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i className="bi bi-calendar3 text-[#2196f3]" />
                                <span>Persebaran Angkatan</span>
                            </h3>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/80">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f8fafc] text-[#1976d2] uppercase tracking-wider border-b border-slate-200 font-bold dark:bg-slate-800/80 dark:text-sky-300 dark:border-white/10">
                                        <tr>
                                            <th className="p-3">Tahun Angkatan</th>
                                            <th className="p-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-200">
                                        {angkatan.length === 0 ? (
                                            <tr><td colSpan="2" className="p-4 text-center text-slate-400">Belum ada data angkatan.</td></tr>
                                        ) : (
                                            angkatan.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                                                    <td className="p-3 font-medium">{row?.label ?? '-'}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-[#2196f3] dark:text-sky-400">{row?.total ?? 0}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Monitoring Akademik Ringkasan */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md space-y-4 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <i className="bi bi-graph-up-arrow text-[#2196f3]" />
                            <span>Monitoring Indeks Prestasi Akademik</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
                                <h4 className="text-2xl font-bold text-[#1976d2] dark:text-sky-400 font-mono">{akademik.rata_ipk ?? 0}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">Rata-rata IPK</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
                                <h4 className="text-2xl font-bold text-[#1976d2] dark:text-sky-400 font-mono">{akademik.rata_ips ?? 0}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">Rata-rata IPS</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
                                <h4 className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">{akademik.bermasalah ?? 0}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">IPK &lt; 2.75</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
                                <h4 className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">{akademik.terlambat_lulus ?? 0}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">Potensi Terlambat</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center pt-4">
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 rounded-full border border-[#2196f3] bg-white px-8 py-3 text-xs font-bold text-[#1976d2] shadow-xs transition duration-200 hover:bg-[#2196f3] hover:text-white dark:bg-white/10 dark:text-white dark:border-sky-400/30"
                        >
                            <i className="bi bi-arrow-left" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
