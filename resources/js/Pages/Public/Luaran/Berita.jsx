import PublicLayout from '../../../Layouts/PublicLayout';

function assetSrc(gambar, fallback = 'assets/dummy.jpg') {
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

export function CmsGrid({ contents = [] }) {
    const rows = toArray(contents);
    if (rows.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
                Belum ada data konten pada bagian ini.
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {rows.map((content, i) => {
                const judul = content?.judul || 'Konten LLD';
                const deskripsi = content?.deskripsi || 'Konten belum tersedia.';
                const gambar = assetSrc(content?.gambar);
                const linkBerita = content?.link_berita || null;
                return (
                    <article
                        key={content?.idCms || content?.slug || i}
                        className="group flex flex-col md:flex-row overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition duration-300 hover:border-[#2196f3]/60 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md dark:hover:border-[#2196f3]/50"
                    >
                        <div className="md:w-5/12 h-64 md:h-auto overflow-hidden bg-slate-100 shrink-0 dark:bg-slate-900">
                            <img
                                src={gambar}
                                alt={judul}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 md:w-7/12">
                            <div>
                                <span className="inline-block rounded-full bg-[#e3f2fd] border border-[#bbdefb] px-3 py-0.5 text-[10px] font-bold text-[#1976d2] uppercase mb-3 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                                    DOKUMENTASI
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 transition group-hover:text-[#1976d2] dark:text-white dark:group-hover:text-sky-300">
                                    {judul}
                                </h2>
                                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                    {deskripsi}
                                </p>
                            </div>
                            {linkBerita && (
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                                    <a
                                        href={linkBerita}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full bg-[#2196f3] hover:bg-[#1976d2] px-5 py-2 text-xs font-bold text-white shadow-md transition"
                                    >
                                        <span>Buka Link Berita</span>
                                        <i className="bi bi-box-arrow-up-right text-[11px]" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export default function Berita({ contents = [], sectionTitle = 'Berita Acara' }) {
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Publikasi &amp; Agenda
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {sectionTitle || 'Berita Acara'}
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Dokumentasi berita acara dan kegiatan LLD UNPAM
                        </p>
                    </div>
                    <CmsGrid contents={contents} />
                </div>
            </section>
        </PublicLayout>
    );
}
