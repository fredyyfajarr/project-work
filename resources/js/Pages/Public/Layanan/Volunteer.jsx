import PublicLayout from '../../../Layouts/PublicLayout';

function toArray(v) {
    return Array.isArray(v) ? v : [];
}

function benefitIcon(b, i) {
    if (b && typeof b === 'object' && b.icon) return b.icon;
    const icons = ['\u{1F3C5}', '\u{1F393}', '\u{1F91D}', '\u{1F4DA}'];
    return icons[i % icons.length];
}

function benefitText(b) {
    if (typeof b === 'string') return b;
    if (b && typeof b === 'object') return b.text || b.label || JSON.stringify(b);
    return String(b ?? '');
}

export default function Volunteer({ volunteer = {} }) {
    const v = volunteer || {};
    const syarat = toArray(v.syarat);
    const alur = toArray(v.alur);
    const benefit = toArray(v.benefit);

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-4xl space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Aksi Sosial &amp; Kepedulian
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Volunteer LLD UNPAM
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Bergabung Menjadi Relawan Pendamping Mahasiswa Disabilitas
                        </p>
                    </div>

                    {/* Pengantar */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md text-slate-700 dark:text-slate-200 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md text-sm leading-relaxed">
                        <p>
                            Program volunteer Lembaga Layanan Disabilitas (LLD) Universitas Pamulang merupakan kegiatan relawan yang bertujuan untuk membantu, mendampingi, serta mendukung mahasiswa disabilitas dalam proses pembelajaran dan aktivitas kampus secara humanis dan setara.
                        </p>
                    </div>

                    {/* Syarat Volunteer */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <i className="bi bi-clipboard-check text-[#2196f3]" />
                            <span>Syarat Menjadi Volunteer</span>
                        </h2>
                        <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                            {syarat.map((s, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-[#2196f3] text-base shrink-0 mt-0.5" />
                                    <span>{typeof s === 'string' ? s : JSON.stringify(s)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Alur Pendaftaran */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <i className="bi bi-diagram-3 text-[#2196f3]" />
                            <span>Alur Pendaftaran Volunteer</span>
                        </h2>
                        <div className="space-y-3">
                            {alur.map((a, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-2xl bg-[#f8fafc] border border-slate-200 p-3.5 text-xs sm:text-sm text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-200">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2196f3] text-white font-bold text-sm shadow-xs">
                                        {i + 1}
                                    </span>
                                    <span>{typeof a === 'string' ? a : JSON.stringify(a)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benefit Volunteer */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <i className="bi bi-gift text-[#2196f3]" />
                            <span>Benefit Volunteer</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {benefit.map((b, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
                                    <span className="text-3xl mb-2">{benefitIcon(b, i)}</span>
                                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-tight">{benefitText(b)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Daftar Volunteer */}
                    <div className="text-center pt-4">
                        <a
                            href="https://shorturl.at/5IaZw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#2196f3] hover:bg-[#1976d2] px-10 py-4 text-sm font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <i className="bi bi-person-plus-fill" />
                            <span>Daftar Menjadi Volunteer LLD</span>
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
