import PublicLayout from '../../../Layouts/PublicLayout';

export default function Sambutan() {
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Pimpinan Lembaga
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Sambutan Kepala Lembaga
                        </h1>
                    </div>

                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-md space-y-8 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <div className="grid md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-4 flex flex-col items-center">
                                <div className="overflow-hidden rounded-2xl border-2 border-[#2196f3]/30 shadow-md w-full max-w-[280px] dark:border-sky-400/30">
                                    <img src="/assets/kepalaLembaga.jpg" alt="Kepala Lembaga LLD UNPAM" className="w-full h-auto object-cover" />
                                </div>
                                <div className="mt-4 text-center">
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide">Dr. NANI RUSNAENI, S.E., M.M.</h2>
                                    <p className="text-xs text-[#1976d2] dark:text-sky-400 font-bold mt-0.5">Kepala Lembaga Layanan Disabilitas</p>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify dark:text-slate-200">
                                <div className="rounded-2xl bg-[#e3f2fd] border border-[#bbdefb] p-4 text-[#1565c0] font-medium italic dark:bg-sky-500/15 dark:border-sky-400/30 dark:text-sky-300">
                                    Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,<br />
                                    Salam sejahtera bagi kita semua.
                                </div>
                                <p>
                                    Puji syukur kita panjatkan ke hadirat Allah SWT, karena pada hari ini kita diberikan kesempatan berharga untuk menyampaikan komitmen bersama: peluncuran Lembaga Layanan Disabilitas (LLD) Universitas Pamulang. Didirikan pada bulan Agustus Tahun 2017, LLD lahir dari visi Universitas Pamulang Humanis dan Religius untuk menciptakan kampus inklusif, yang setara, demokratis, dan memperjuangkan keadilan bagi seluruh civitas, khususnya saudara-saudara penyandang disabilitas.
                                </p>
                                <p>
                                    Kami percaya bahwa setiap individu, dengan segala keunikannya, memiliki potensi besar untuk berkembang. LLD hadir sebagai wujud nyata dedikasi Universitas Pamulang untuk memberikan akses pendidikan berkualitas dan mendukung mahasiswa disabilitas agar dapat meraih prestasi secara maksimal.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify dark:border-white/10 dark:text-slate-200">
                            <p>
                                Kami berterimakasih pada Almarhum Bapak Dr. (H.C) H. Drs. Darsono, dan sekarang estafet kepemimpinan Yayasan dilanjutkan oleh Ketua Yayasan Dr. Pranoto, S.E., M.M., atas segala dukungan serta komitmen Yayasan Sasmita Jaya Group dalam memperjuangkan mobilitas pendidikan inklusif.
                            </p>
                            <p>
                                Mari kita jadikan momentum bersejarah ini sebagai titik tolak untuk memperluas akses pendidikan, memperkuat fasilitasi, dan menghadirkan layanan yang responsif terhadap kebutuhan setiap mahasiswa disabilitas.
                            </p>
                            <p>
                                Akhir kata, semoga Lembaga Layanan Disabilitas (LLD) Universitas Pamulang tidak hanya menjadi tempat layanan, tetapi juga menjadi simbol harapan, membuka jalan bagi generasi inklusif yang unggul, berakhlak mulia, dan berdampak bagi bangsa dan negara.
                            </p>
                            <div className="pt-4 text-right">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</p>
                                <p className="text-xs text-[#1976d2] dark:text-sky-400 font-bold mt-1">Hormat Kami,</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Kepala LLD Universitas Pamulang</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
