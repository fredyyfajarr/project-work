import PublicLayout from '../../../Layouts/PublicLayout';

function assetSrc(gambar, fallback = 'assets/kalenderakademik.png') {
    const g = gambar || fallback;
    const s = String(g);
    if (/^https?:\/\//.test(s)) return s;
    return `/${s.replace(/^\//, '')}`;
}

function toArray(v) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') return Object.values(v);
    return [];
}

export default function Kalender({ contents = [] }) {
    const rows = toArray(contents);

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Agenda Akademik
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Kalender Akademik
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Informasi jadwal perkuliahan dan agenda akademik layanan mahasiswa disabilitas
                        </p>
                    </div>

                    {rows.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
                            Belum ada jadwal kalender akademik aktif saat ini.
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {rows.map((content, i) => {
                                const judul = content?.judul || 'Semester / Tahun Ajaran';
                                const deskripsi = content?.deskripsi || '';
                                const gambar = assetSrc(content?.gambar);
                                return (
                                    <article
                                        key={content?.idCms || content?.slug || i}
                                        className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md p-6 sm:p-8 space-y-4 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md"
                                    >
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                                            <i className="bi bi-calendar-check text-[#2196f3]" />
                                            <span>{judul}</span>
                                        </h2>
                                        {deskripsi !== '' && (
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                {deskripsi}
                                            </p>
                                        )}
                                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-slate-900">
                                            <img
                                                src={gambar}
                                                alt={judul}
                                                className="w-full h-auto object-contain max-h-[800px] mx-auto"
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
