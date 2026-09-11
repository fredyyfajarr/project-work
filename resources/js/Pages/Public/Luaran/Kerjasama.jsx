import PublicLayout from '../../../Layouts/PublicLayout';
import { CmsGrid } from './Berita';

export default function Kerjasama({ contents = [], sectionTitle = 'Implementasi Kerja Sama' }) {
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Kemitraan &amp; Sinergi
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {sectionTitle || 'Implementasi Kerja Sama'}
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Dokumentasi kerja sama dan kolaborasi LLD UNPAM bersama berbagai mitra
                        </p>
                    </div>
                    <CmsGrid contents={contents} />
                </div>
            </section>
        </PublicLayout>
    );
}
