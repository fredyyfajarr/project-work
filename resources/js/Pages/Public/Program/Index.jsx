import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { route } from '../../../lib/route';

const ROUTE_PATH = {
    'sosialisasi-inklusi-kampus': '/program/inklusi',
    'setara-pmbd': '/program/setara',
    'adik-beasiswa-yayasan': '/program/beasiswa',
    'pelita-disabilitas': '/program/pelita',
    link: '/program/link',
};

const FALLBACK_ORDER = [
    'sosialisasi-inklusi-kampus',
    'setara-pmbd',
    'adik-beasiswa-yayasan',
    'pelita-disabilitas',
    'link',
];

const FALLBACK_NAMES = {
    'sosialisasi-inklusi-kampus': 'Sosialisasi Inklusi Kampus',
    'setara-pmbd': 'SETARA PMBD',
    'adik-beasiswa-yayasan': 'ADIK dan Beasiswa Yayasan',
    'pelita-disabilitas': 'PELITA Disabilitas',
    link: 'LINK',
};

const PROGRAM_ICONS = {
    'sosialisasi-inklusi-kampus': 'bi-people-fill',
    'setara-pmbd': 'bi-mortarboard-fill',
    'adik-beasiswa-yayasan': 'bi-award-fill',
    'pelita-disabilitas': 'bi-brightness-high-fill',
    link: 'bi-link-45deg',
};

export default function Index({ programSections = {} }) {
    const sections = programSections && typeof programSections === 'object' ? programSections : {};
    let entries = Object.entries(sections);
    if (entries.length === 0) {
        entries = FALLBACK_ORDER.map((slug) => [slug, { nama_menu: FALLBACK_NAMES[slug] }]);
    }

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Pemberdayaan &amp; Layanan
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                            PROGRAM KERJA
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Inisiatif dan program layanan komprehensif bagi mahasiswa disabilitas Universitas Pamulang
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {entries.map(([menuSlug, program]) => {
                            const href = ROUTE_PATH[menuSlug] || route('program.index');
                            const nama = program?.nama_menu || FALLBACK_NAMES[menuSlug] || menuSlug;
                            const icon = PROGRAM_ICONS[menuSlug] || 'bi-bookmark-star-fill';
                            return (
                                <Link
                                    key={menuSlug}
                                    href={href}
                                    className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition duration-300 hover:border-[#2196f3]/60 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md dark:hover:border-[#2196f3]/50"
                                >
                                    <div>
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2196f3] text-white text-xl shadow-md mb-4 transition duration-300 group-hover:scale-110">
                                            <i className={`bi ${icon}`} />
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white transition group-hover:text-[#1976d2] dark:group-hover:text-sky-300">
                                            {nama}
                                        </h2>
                                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            Klik untuk melihat detail program, dokumentasi, dan pelaksanaan kegiatan.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#2196f3] dark:text-sky-400 transition group-hover:text-[#1976d2] dark:group-hover:text-sky-300 group-hover:translate-x-1">
                                        <span>Lihat Selengkapnya</span>
                                        <i className="bi bi-arrow-right" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
