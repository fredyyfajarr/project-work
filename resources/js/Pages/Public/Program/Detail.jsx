import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { route } from '../../../lib/route';
import { CmsGrid } from '../Luaran/Berita';

function toArray(v) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') return Object.values(v);
    return [];
}

export default function Detail({ sectionTitle = 'Program LLD', contents = [] }) {
    const rows = toArray(contents);
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl space-y-8">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Program Kerja LLD
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {sectionTitle || 'Program LLD'}
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Dokumentasi dan informasi pelaksanaan program kerja LLD Universitas Pamulang
                        </p>
                    </div>

                    <CmsGrid contents={rows} />

                    <div className="text-center pt-8">
                        <Link
                            href={route('program.index')}
                            className="inline-flex items-center gap-2 rounded-full border border-[#2196f3] bg-white dark:bg-white/10 dark:text-white dark:border-sky-400/30 px-7 py-3 text-xs font-bold text-[#1976d2] shadow-xs transition duration-200 hover:bg-[#2196f3] hover:text-white"
                        >
                            <i className="bi bi-arrow-left" />
                            <span>Kembali ke Program</span>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
