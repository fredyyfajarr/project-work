import PublicLayout from '../../../Layouts/PublicLayout';

export default function Pmb() {
    const berkas = [
        'KTP', 'Kartu Keluarga (KK)', 'Akta Kelahiran', 'Ijazah / SKL',
        'Pas Foto (Background Merah)', 'Surat Izin Orang Tua',
        'Surat Kesanggupan Biaya', 'Sertifikat Prestasi (Opsional)',
        'Surat Keterangan Disabilitas', 'Surat Keterangan Kerja (Reguler C)',
    ];

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-4xl space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Penerimaan Mahasiswa Baru
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            PMB Mahasiswa Disabilitas
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Universitas Pamulang (UNPAM) — Pendidikan Terbuka &amp; Inklusif untuk Semua
                        </p>
                    </div>

                    {/* Pengantar */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md text-slate-700 dark:text-slate-200 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md text-sm leading-relaxed space-y-3">
                        <p>
                            Selamat datang di portal Penerimaan Mahasiswa Baru Disabilitas Universitas Pamulang. Formulir ini diperuntukkan bagi calon mahasiswa disabilitas yang ingin melanjutkan pendidikan tinggi di UNPAM.
                        </p>
                        <p>
                            Data yang Anda isi akan digunakan untuk proses pendataan, penilaian kelayakan, serta penentuan layanan pendukung (aksesibilitas) selama perkuliahan.
                        </p>
                    </div>

                    {/* Informasi Pendaftaran */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <i className="bi bi-info-circle-fill text-[#2196f3]" />
                            <span>Informasi Pendaftaran</span>
                        </h2>
                        <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                            {[
                                'Pendaftaran dilakukan secara online melalui Lembaga Layanan Disabilitas Universitas Pamulang.',
                                'Calon mahasiswa wajib mengisi data diri secara lengkap, jujur, dan benar.',
                                'Informasi yang dikumpulkan akan dijamin kerahasiaannya dan digunakan hanya untuk keperluan akademik serta layanan aksesibilitas.',
                                'Setelah pengisian formulir, calon mahasiswa akan dihubungi oleh tim terkait untuk proses verifikasi atau wawancara kebutuhan khusus.',
                            ].map((info, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <i className="bi bi-check2-circle text-[#2196f3] text-base shrink-0 mt-0.5" />
                                    <span>{info}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Berkas yang Harus Disiapkan */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <i className="bi bi-folder-check text-[#2196f3]" />
                            <span>Berkas yang Harus Disiapkan</span>
                        </h2>
                        <p className="text-xs text-[#1976d2] dark:text-sky-300 mb-4 font-bold">Format berkas: JPG / PNG / PDF (Maksimal 2MB per file)</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {berkas.map((b, idx) => (
                                <div key={idx} className="flex items-center gap-2 rounded-xl bg-[#f8fafc] border border-slate-200 px-3.5 py-2.5 text-xs text-slate-700 font-medium dark:bg-white/5 dark:border-white/10 dark:text-slate-200">
                                    <i className="bi bi-file-earmark-text text-[#2196f3]" />
                                    <span>{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Download Berkas Surat & Kontak */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md flex flex-col justify-between dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Unduh Format Surat</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                                    Format surat pernyataan kesanggupan dan permohonan aksesibilitas.
                                </p>
                            </div>
                            <a
                                href="https://drive.google.com/drive/folders/1LXGtE-b14nrZDJIc1DcQodO65FZ9WlkM?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2196f3] bg-white py-2.5 px-4 text-xs font-bold text-[#1976d2] hover:bg-[#2196f3] hover:text-white transition dark:bg-white/10 dark:text-white dark:border-sky-400/40"
                            >
                                <i className="bi bi-download" />
                                <span>Download Format Surat</span>
                            </a>
                        </div>

                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md flex flex-col justify-between dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Pusat Bantuan PMB</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                                    Informasi lebih lanjut mengenai tata cara pendaftaran:
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#e8f5e9] border border-[#c8e6c9] p-3 text-xs text-slate-800 flex items-center gap-2 dark:bg-emerald-950/40 dark:border-emerald-700/40 dark:text-emerald-200">
                                <i className="bi bi-whatsapp text-emerald-600 dark:text-emerald-400 text-lg" />
                                <span>Ardilla: <strong>0896-2939-1222</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Daftar Sekarang */}
                    <div className="text-center pt-4">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfbNOU-NMjZ8d6-qNWovrOemOT6gPv1liZhwfrmwhZ_OzmQjQ/viewform"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#2196f3] hover:bg-[#1976d2] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                        >
                            <i className="bi bi-pencil-square" />
                            <span>Daftar Sekarang (Formulir Online)</span>
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
