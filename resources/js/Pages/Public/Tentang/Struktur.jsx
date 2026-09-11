import PublicLayout from '../../../Layouts/PublicLayout';

export default function Struktur() {
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Tata Kelola Organisasi
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Struktur Organisasi
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Lembaga Layanan Disabilitas Universitas Pamulang
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-md flex justify-center dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm max-w-4xl w-full bg-white dark:border-white/10 dark:bg-slate-900">
                            <img
                                src="/assets/struktur.jpg"
                                alt="Bagan Struktur Organisasi LLD UNPAM"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
