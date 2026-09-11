import PublicLayout from '../../../Layouts/PublicLayout';

export default function Sejarah() {
    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Profil &amp; Rekam Jejak
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Sejarah Lembaga Layanan Disabilitas
                        </h1>
                    </div>

                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-md space-y-8 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <div className="grid md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-5">
                                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-white/10">
                                    <img src="/assets/sejarah.png" alt="Sejarah LLD UNPAM" className="w-full h-auto object-cover hover:scale-105 transition duration-500" />
                                </div>
                            </div>
                            <div className="md:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify dark:text-slate-200">
                                <p>
                                    Lembaga Layanan Disabilitas Universitas Pamulang merupakan lembaga yang bertugas menyediakan layanan dan dukungan bagi mahasiswa penyandang disabilitas di lingkungan Universitas Pamulang. Lembaga ini berfokus pada pemenuhan akses pendidikan yang inklusif dan berkesetaraan, baik dari segi fasilitas maupun dukungan akademik.
                                </p>
                                <p>
                                    Lembaga Layanan Disabilitas Universitas Pamulang resmi didirikan pada 1 Agustus 2017 berdasarkan Surat Keputusan Rektor Nomor 507/A/O/UNIVERSITAS PAMULANG/VIII/2017. Sejak tahun akademik 2017, Universitas Pamulang mulai menerima mahasiswa penyandang disabilitas, khususnya tunanetra. Hingga saat ini, terdapat mahasiswa disabilitas netra, disabilitas tuli, dan disabilitas daksa, yang tersebar di 12 program studi.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6 text-slate-700 text-sm sm:text-base leading-relaxed text-justify dark:border-white/10 dark:text-slate-200">
                            <p>
                                Mahasiswa penyandang disabilitas di Universitas Pamulang mendapatkan hak yang sama dalam proses pembelajaran serta layanan, baik akademik maupun non-akademik. Hal ini didukung dengan hadirnya Lembaga Layanan Disabilitas Universitas Pamulang sebagai bentuk komitmen dalam mewujudkan pendidikan yang inklusif. Semangat belajar mahasiswa penyandang disabilitas pun sangat tinggi, didukung oleh fasilitas dan aksesibilitas yang berada di Universitas Pamulang. Banyak di antara mereka yang memiliki tekad kuat untuk meraih kesuksesan, seperti menjadi programmer yang andal, pengajar profesional, dan bekerja sesuai bidang keahliannya.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
