import PublicLayout from '../../Layouts/PublicLayout';
import { route } from '../../lib/route';

function assetSrc(gambar) {
    if (!gambar) return null;
    const g = String(gambar);
    if (/^https?:\/\//.test(g)) return g;
    return `/${g.replace(/^\//, '')}`;
}

function isExternal(url) {
    return /^https?:\/\//.test(String(url || ''));
}

export default function Search({ query = '', results = [] }) {
    const q = query ?? '';
    const rows = Array.isArray(results) ? results : [];

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Search Section */}
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Pusat Pencarian
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                            HASIL PENCARIAN
                        </h1>
                        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
                            Cari informasi pada halaman profil lembaga, menu Luaran, Layanan, Program, Berita Acara, dan konten publik lainnya.
                        </p>

                        <form action={route('search')} method="GET" className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                            <input
                                type="text"
                                name="q"
                                defaultValue={q}
                                placeholder="Masukkan kata kunci pencarian..."
                                autoFocus
                                className="flex-1 px-5 py-3.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#2196f3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#2196f3]/20 shadow-sm"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#2196f3] hover:bg-[#1976d2] text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                            >
                                <i className="bi bi-search"></i>
                                <span>Cari</span>
                            </button>
                        </form>
                    </div>

                    {/* Results / Empty States */}
                    {q === '' ? (
                        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-md dark:backdrop-blur-md">
                            <div className="w-14 h-14 rounded-full bg-[#e3f2fd] border border-[#bbdefb] dark:bg-sky-500/20 dark:border-sky-400/30 flex items-center justify-center mx-auto mb-4 text-[#1976d2] dark:text-sky-300 text-2xl">
                                <i className="bi bi-search"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Masukkan kata kunci terlebih dahulu</h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Contoh kata kunci: <strong className="text-[#1976d2] dark:text-sky-400">berita acara</strong>, <strong className="text-[#1976d2] dark:text-sky-400">kalender akademik</strong>, <strong className="text-[#1976d2] dark:text-sky-400">beasiswa</strong>, atau <strong className="text-[#1976d2] dark:text-sky-400">volunteer</strong>.
                            </p>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900/60 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-md dark:backdrop-blur-md">
                            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400 text-2xl">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tidak ada hasil untuk &ldquo;{q}&rdquo;</h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Coba gunakan kata kunci lain yang lebih umum, misalnya &ldquo;program&rdquo;, &ldquo;layanan&rdquo;, &ldquo;berita&rdquo;, atau &ldquo;disabilitas&rdquo;.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-white/10">
                                Ditemukan <strong className="text-[#1976d2] dark:text-sky-400 font-bold">{rows.length}</strong> hasil untuk &ldquo;{q}&rdquo;
                            </div>

                            <div className="space-y-3.5">
                                {rows.map((result, i) => {
                                    const url = result?.url || '/';
                                    const image = assetSrc(result?.image);
                                    const external = isExternal(url);
                                    return (
                                        <a
                                            key={i}
                                            href={url}
                                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 border-l-4 border-l-[#2196f3] dark:border-l-[#2196f3] hover:border-[#2196f3] dark:hover:border-sky-400 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 text-slate-800 dark:text-slate-100 no-underline shadow-sm dark:backdrop-blur-md"
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={result?.title || 'Hasil pencarian'}
                                                    className="w-full sm:w-44 h-28 rounded-xl object-cover flex-shrink-0 group-hover:scale-[1.02] transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full sm:w-44 h-28 rounded-xl bg-[#e3f2fd] dark:bg-sky-950/60 flex items-center justify-center text-3xl text-[#1976d2] dark:text-sky-400 flex-shrink-0">
                                                    <i className="bi bi-file-earmark-text"></i>
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#1976d2] dark:text-sky-400 mb-1">
                                                    {result?.category || 'Konten'}
                                                </span>
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1976d2] dark:group-hover:text-sky-400 transition-colors mb-1.5 truncate">
                                                    {result?.title || '-'}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {String(result?.description || '').replace(/<[^>]*>/g, '').slice(0, 170)}
                                                </p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
