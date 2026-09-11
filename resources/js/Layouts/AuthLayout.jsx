import { Link } from '@inertiajs/react';
import Flash from '../Components/Flash';
import { useTheme } from '../lib/theme';
import AccessibilityWidget from '../Components/AccessibilityWidget';

export default function AuthLayout({ children, title = 'Login Sistem', subtitle = 'Admin & Mahasiswa LLD UNPAM', flash }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen w-full bg-[#eef5fb] font-sans text-slate-800 antialiased dark:bg-[#050d24] dark:text-slate-100 transition-colors duration-300">
            {/* SISI KIRI: Desktop Visual & Kampus UNPAM (Visible on desktop lg+) */}
            <aside className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] 2xl:w-[55%] flex-col justify-between overflow-hidden bg-slate-950 p-8 sm:p-10 xl:p-14 text-white select-none">
                {/* Background Image UNPAM Campus (Crisp, Natural, Same as Landing Page) */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/BG UNPAM.jpg')" }}
                />

                {/* Clean Contrast Shadow Overlay (Natural, No Color Fog, Same as Landing Page) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-[#050d24]" />

                {/* Top: 3 Logo Resmi (Yayasan, UNPAM, LLD) */}
                <div className="relative z-10 flex items-center gap-5 sm:gap-6">
                    <img
                        src="/assets/Logo Yayasan Sasmita Jaya.png"
                        alt="Logo Yayasan Sasmita Jaya"
                        className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg"
                    />
                    <img
                        src="/assets/Logo UNPAM.png"
                        alt="Logo UNPAM"
                        className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg"
                    />
                    <img
                        src="/assets/Logo LLD.png"
                        alt="Logo LLD"
                        className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg"
                    />
                </div>

                {/* Middle: Headline, Deskripsi, Fitur Inklusif */}
                <div className="relative z-10 my-auto py-8">
                    <h1 className="text-3xl font-black tracking-tight text-white xl:text-4xl drop-shadow-md">
                        LEMBAGA LAYANAN DISABILITAS
                    </h1>
                    <h2 className="mt-1 text-xl font-bold tracking-wide text-sky-400 xl:text-2xl">
                        UNIVERSITAS PAMULANG
                    </h2>

                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-200/90 xl:text-base font-light">
                        Mewujudkan lingkungan akademik inklusif, ramah disabilitas, dan berkeadilan demi kesetaraan hak belajar seluruh sivitas akademika Universitas Pamulang.
                    </p>

                    {/* Fitur Pills */}
                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm shadow-sm">
                            <i className="bi bi-universal-access text-sky-300 text-sm" />
                            <span>Akses Inklusif</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm shadow-sm">
                            <i className="bi bi-shield-check text-emerald-300 text-sm" />
                            <span>Akun Terverifikasi</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm shadow-sm">
                            <i className="bi bi-mortarboard text-amber-300 text-sm" />
                            <span>SIM Akademik</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-slate-300">
                    <span>© Universitas Pamulang • Berbagi untuk Sesama</span>
                    <span className="font-medium text-sky-400">Humanis &amp; Religius</span>
                </div>
            </aside>

            {/* SISI KANAN: Form Side (Full width mobile, 50% desktop) */}
            <main className="flex w-full flex-1 flex-col justify-between overflow-y-auto bg-[#eef5fb] dark:bg-[#050d24] px-4 py-8 sm:px-8 md:px-12 lg:w-1/2 xl:w-[48%] xl:px-16 transition-colors duration-300">
                {/* Top Navigation Bar: Back link & Theme toggle */}
                <div className="flex items-center justify-between w-full max-w-[440px] mx-auto mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2196f3] transition dark:text-slate-300 dark:hover:text-sky-300"
                    >
                        <i className="bi bi-arrow-left text-sm" />
                        <span>Ke Beranda</span>
                    </Link>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#2196f3] transition shadow-xs cursor-pointer dark:border-white/15 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-sky-300"
                        title={isDark ? 'Beralih ke Tema Terang (Light Academic)' : 'Beralih ke Tema Gelap (Dark Midnight)'}
                        aria-label="Ganti Tema"
                    >
                        <i className={`bi ${isDark ? 'bi-sun text-amber-300' : 'bi-moon-stars text-slate-600'}`} />
                    </button>
                </div>

                {/* Centered Form Card Container */}
                <div className="my-auto mx-auto w-full max-w-[440px] py-2">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-2xl dark:shadow-black/50 dark:backdrop-blur-xl">
                        {/* Brand Logo & Header */}
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-2xl bg-[#e3f2fd] px-3.5 py-1.5 border border-[#bbdefb] dark:bg-sky-500/20 dark:border-sky-400/30">
                                <img src="/assets/Logo LLD.png" alt="Logo LLD" className="h-6 w-6 object-contain" />
                                <span className="text-xs font-bold tracking-wider text-[#1976d2] dark:text-sky-300 uppercase">LLD UNPAM</span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </div>

                        <Flash success={flash?.success} error={flash?.error} />
                        {children}
                    </div>
                </div>

                {/* Footer copy */}
                <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    Sistem Informasi Layanan Disabilitas • Universitas Pamulang
                </div>
            </main>

            {/* Accessibility Widget Floating Button & Panel */}
            <AccessibilityWidget />
        </div>
    );
}
