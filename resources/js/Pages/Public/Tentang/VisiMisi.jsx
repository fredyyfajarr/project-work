import PublicLayout from '../../../Layouts/PublicLayout';

export default function VisiMisi() {
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Arah &amp; Komitmen
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Visi &amp; Misi
                        </h1>
                    </div>

                    <div className="grid md:grid-cols-12 gap-6">
                        {/* Visi Card (Vibrant UNPAM Blue) */}
                        <div className="md:col-span-5 rounded-3xl border border-[#90caf9] bg-gradient-to-br from-[#1e88e5] to-[#2196f3] p-6 sm:p-8 shadow-md text-white flex flex-col justify-between dark:from-[#0d47a1]/80 dark:to-[#1565c0]/80 dark:border-sky-500/30">
                            <div>
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 border border-white/30 text-white mb-4">
                                    <i className="bi bi-eye-fill text-2xl" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">VISI</h2>
                                <p className="mt-4 text-white/95 text-sm sm:text-base leading-relaxed font-normal">
                                    Menjadi pusat layanan disabilitas yang bermutu, berbasis teknologi, untuk menciptakan lulusan yang mandiri dan unggul berlandaskan Ridho Tuhan Yang Maha Esa.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-white/20 text-xs text-sky-100 font-bold tracking-wider uppercase">
                                Mandiri • Unggul • Humanis
                            </div>
                        </div>

                        {/* Misi Card (Clean White Card) */}
                        <div className="md:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2fd] border border-[#bbdefb] text-[#1976d2] mb-4 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                                <i className="bi bi-bullseye text-2xl" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">MISI</h2>
                            <ul className="space-y-3.5 text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                                {[
                                    'Menyelenggarakan pembelajaran keilmuan dan keterampilan, riset beriring pengabdian pada masyarakat yang berkualitas dengan mempertimbangkan daya jangkau semua kalangan.',
                                    'Melakukan kerja sama lintas lembaga, menunjang sinergilitas dan motivasi kompetitif kajian dan implementasi Tri Dharma Perguruan Tinggi.',
                                    'Mengintensifkan studi nilai-nilai dan norma-norma religiusitas terkait ketuhanan, peribadatan, akhlak mulia, keilmuan, dan kehidupan yang hasilnya diintegrasikan ke dalam mata kuliah secara relevan.',
                                    'Menciptakan lulusan profesional dalam kompetensinya, berjiwa mandiri dan berakhlak mulia yang dilandasi nilai dan norma keimanan dan ketakwaan kepada Tuhan Yang Maha Esa.',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e3f2fd] text-[#1976d2] text-xs font-bold border border-[#bbdefb] mt-0.5 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-400/30">
                                            {idx + 1}
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
