import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AccessibilityWidget from '../Components/AccessibilityWidget';
import { useTheme } from '../lib/theme';

const TENTANG = [
    { label: 'Sejarah LLD', href: '/tentang/sejarah' },
    { label: 'Sambutan Kepala LLD', href: '/tentang/sambutan' },
    { label: 'Visi & Misi LLD', href: '/tentang/visi-misi' },
    { label: 'Struktur Organisasi', href: '/tentang/struktur' },
];
const LUARAN = [
    { label: 'Berita Acara', href: '/luaran/berita' },
    { label: 'Implementasi Kerja Sama', href: '/luaran/kerjasama' },
    { label: 'Pelatihan Juru Bahasa Isyarat', href: '/luaran/pelatihan' },
];
const LAYANAN = [
    { label: 'PMB Mahasiswa Disabilitas', href: '/layanan/pmb' },
    { label: 'Volunteer', href: '/layanan/volunteer' },
    { label: 'Kalender Akademik', href: '/layanan/kalender' },
];

function Dropdown({ label, items, active }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 220);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    return (
        <li
            ref={ref}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(!open);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition duration-150 cursor-pointer ${
                    active ? 'bg-white/20 font-bold text-white shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/10 font-medium'
                }`}
            >
                <span>{label}</span>
                <i className={`bi bi-chevron-down text-[11px] transition-transform duration-200 ${open ? 'rotate-180 text-white' : 'text-white/70'}`} />
            </button>

            {/* Submenu Floating Card dengan padding bridge agar mouse tidak pernah disconnect */}
            <div
                className={`absolute top-full left-0 pt-2 w-64 z-50 transition-all duration-200 ${
                    open ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#071330]/95 dark:shadow-slate-950/60">
                    <ul className="space-y-1">
                        {items.map((it) => (
                            <li key={it.href}>
                                <Link
                                    href={it.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-[#e3f2fd] hover:text-[#1976d2] hover:translate-x-1 dark:text-slate-200 dark:hover:bg-sky-500/20 dark:hover:text-sky-300"
                                >
                                    {it.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </li>
    );
}

export default function PublicLayout({ children }) {
    const { url } = usePage();
    const { isDark, toggleTheme } = useTheme();
    const path = url.split('?')[0];
    const [q, setQ] = useState('');
    const [searchOpen, setSearchOpen] = useState(path === '/search');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAcc, setMobileAcc] = useState({ tentang: false, luaran: false, layanan: false });
    const searchRef = useRef(null);

    useEffect(() => {
        setMobileOpen(false);
    }, [path]);

    useEffect(() => {
        const close = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target) && q.trim() === '') {
                setSearchOpen(false);
            }
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [q]);

    const toggleAcc = (key) => {
        setMobileAcc((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#eef5fb] text-slate-800 selection:bg-[#2196f3] selection:text-white font-sans antialiased dark:bg-[#050d24] dark:text-slate-100">
            {/* TOP NAVBAR (Light Academic UNPAM Blue / Dark Midnight Frosted Glass) */}
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[#1e88e5] bg-gradient-to-r from-[#1e88e5] to-[#2196f3] px-4 py-3 shadow-md backdrop-blur-md sm:px-8 text-white dark:from-[#071330]/95 dark:to-[#050d24]/95 dark:border-white/10 dark:shadow-slate-950/60">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 font-bold text-white transition hover:opacity-90">
                    <img src="/assets/Logo LLD.png" alt="Logo LLD" className="h-9 w-9 object-contain drop-shadow" />
                    <div className="leading-tight">
                        <span className="block text-sm font-extrabold tracking-tight text-white sm:text-base">
                            LEMBAGA LAYANAN DISABILITAS
                        </span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-white/85 dark:text-sky-300/90">
                            UNIVERSITAS PAMULANG
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <ul className="hidden lg:flex items-center gap-2 ml-auto mr-6 text-sm font-medium">
                    <li>
                        <Link
                            href="/"
                            className={`px-3 py-1.5 rounded-lg transition ${
                                path === '/' ? 'bg-white/20 font-bold text-white shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/10 font-medium'
                            }`}
                        >
                            Home
                        </Link>
                    </li>

                    <Dropdown label="Tentang" items={TENTANG} active={path.startsWith('/tentang')} />
                    <Dropdown label="Luaran" items={LUARAN} active={path.startsWith('/luaran')} />
                    <Dropdown label="Layanan" items={LAYANAN} active={path.startsWith('/layanan')} />

                    <li>
                        <Link
                            href="/program"
                            className={`px-3 py-1.5 rounded-lg transition ${
                                path.startsWith('/program') ? 'bg-white/20 font-bold text-white shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/10 font-medium'
                            }`}
                        >
                            Program
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/kontak"
                            className={`px-3 py-1.5 rounded-lg transition ${
                                path.startsWith('/kontak') ? 'bg-white/20 font-bold text-white shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/10 font-medium'
                            }`}
                        >
                            Kontak
                        </Link>
                    </li>
                </ul>

                {/* Right Action: Search, Theme Toggle & Login */}
                <div className="flex items-center gap-2.5">
                    <form
                        ref={searchRef}
                        className="relative flex items-center"
                        action="/search"
                        method="GET"
                        onSubmit={(e) => {
                            if (!searchOpen || q.trim().length === 0) {
                                e.preventDefault();
                                setSearchOpen(true);
                                searchRef.current?.querySelector('input')?.focus();
                            }
                        }}
                    >
                        <input
                            type="text"
                            name="q"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setQ('');
                                    setSearchOpen(false);
                                }
                            }}
                            placeholder="Cari konten..."
                            autoComplete="off"
                            className={`rounded-full border border-white/30 bg-white/20 px-3.5 py-1.5 text-xs text-white placeholder-white/75 outline-none transition-all duration-300 focus:bg-white focus:text-slate-800 focus:placeholder-slate-400 focus:ring-2 focus:ring-white/40 ${
                                searchOpen ? 'w-36 sm:w-48 opacity-100 pr-8' : 'w-0 opacity-0 pointer-events-none p-0 border-transparent'
                            }`}
                        />
                        <button
                            type="submit"
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/20 transition cursor-pointer ${
                                searchOpen ? 'absolute right-0' : ''
                            }`}
                            aria-label="Cari konten"
                        >
                            <i className="bi bi-search text-sm"></i>
                        </button>
                    </form>

                    {/* Dual Theme Switcher Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 hover:scale-105 active:scale-95 transition cursor-pointer shadow-xs"
                        aria-label={isDark ? 'Beralih ke Tema Light Academic' : 'Beralih ke Tema Dark Midnight'}
                        title={isDark ? 'Beralih ke Light Academic (My UNPAM)' : 'Beralih ke Dark Midnight (Cinematic)'}
                    >
                        <i className={`bi ${isDark ? 'bi-sun-fill text-amber-300 text-sm' : 'bi-moon-stars-fill text-sky-100 text-xs'}`} />
                    </button>

                    <Link
                        href="/login"
                        className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-[#1976d2] shadow-sm hover:bg-sky-50 hover:shadow transition duration-200 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border dark:border-white/20"
                    >
                        <i className="bi bi-box-arrow-in-right text-sm"></i>
                        <span>Login</span>
                    </Link>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition lg:hidden cursor-pointer"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        <i className={`bi ${mobileOpen ? 'bi-x-lg text-base' : 'bi-list text-xl'}`}></i>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Drawer Sesuai My Unpam (Light Academic / Dark Midnight) */}
            {mobileOpen && (
                <div className="fixed inset-x-0 top-[59px] bottom-0 z-40 overflow-y-auto bg-white p-6 shadow-2xl border-t border-slate-200 lg:hidden dark:bg-[#071330] dark:border-white/10 dark:text-slate-100">
                    <ul className="space-y-2 text-sm">
                        {/* Mobile Theme Toggle Row */}
                        <li className="pb-3 mb-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                                Mode Tampilan
                            </span>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 transition cursor-pointer"
                            >
                                <i className={`bi ${isDark ? 'bi-sun-fill text-amber-400' : 'bi-moon-stars-fill text-[#1976d2]'}`} />
                                <span>{isDark ? 'Light Academic' : 'Dark Midnight'}</span>
                            </button>
                        </li>

                        <li>
                            <Link
                                href="/"
                                onClick={() => setMobileOpen(false)}
                                className={`block rounded-xl p-3 font-semibold transition ${
                                    path === '/'
                                        ? 'bg-[#e3f2fd] text-[#1976d2] dark:bg-sky-500/20 dark:text-sky-300'
                                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'
                                }`}
                            >
                                Home
                            </Link>
                        </li>

                        <li>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl p-3 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 transition cursor-pointer"
                                onClick={() => toggleAcc('tentang')}
                            >
                                <span>Tentang</span>
                                <i className={`bi bi-chevron-${mobileAcc.tentang ? 'up' : 'down'} text-xs text-[#2196f3]`} />
                            </button>
                            {mobileAcc.tentang && (
                                <ul className="mt-1 ml-3 space-y-1 border-l-2 border-[#2196f3]/40 pl-3">
                                    {TENTANG.map((it) => (
                                        <li key={it.href}>
                                            <Link
                                                href={it.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="block rounded-lg py-2 px-3 text-xs text-slate-600 hover:bg-[#e3f2fd] hover:text-[#1976d2] dark:text-slate-300 dark:hover:bg-sky-500/20 dark:hover:text-sky-300"
                                            >
                                                {it.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl p-3 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 transition cursor-pointer"
                                onClick={() => toggleAcc('luaran')}
                            >
                                <span>Luaran</span>
                                <i className={`bi bi-chevron-${mobileAcc.luaran ? 'up' : 'down'} text-xs text-[#2196f3]`} />
                            </button>
                            {mobileAcc.luaran && (
                                <ul className="mt-1 ml-3 space-y-1 border-l-2 border-[#2196f3]/40 pl-3">
                                    {LUARAN.map((it) => (
                                        <li key={it.href}>
                                            <Link
                                                href={it.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="block rounded-lg py-2 px-3 text-xs text-slate-600 hover:bg-[#e3f2fd] hover:text-[#1976d2] dark:text-slate-300 dark:hover:bg-sky-500/20 dark:hover:text-sky-300"
                                            >
                                                {it.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl p-3 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 transition cursor-pointer"
                                onClick={() => toggleAcc('layanan')}
                            >
                                <span>Layanan</span>
                                <i className={`bi bi-chevron-${mobileAcc.layanan ? 'up' : 'down'} text-xs text-[#2196f3]`} />
                            </button>
                            {mobileAcc.layanan && (
                                <ul className="mt-1 ml-3 space-y-1 border-l-2 border-[#2196f3]/40 pl-3">
                                    {LAYANAN.map((it) => (
                                        <li key={it.href}>
                                            <Link
                                                href={it.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="block rounded-lg py-2 px-3 text-xs text-slate-600 hover:bg-[#e3f2fd] hover:text-[#1976d2] dark:text-slate-300 dark:hover:bg-sky-500/20 dark:hover:text-sky-300"
                                            >
                                                {it.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link
                                href="/program"
                                onClick={() => setMobileOpen(false)}
                                className={`block rounded-xl p-3 font-semibold transition ${
                                    path.startsWith('/program')
                                        ? 'bg-[#e3f2fd] text-[#1976d2] dark:bg-sky-500/20 dark:text-sky-300'
                                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'
                                }`}
                            >
                                Program
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/kontak"
                                onClick={() => setMobileOpen(false)}
                                className={`block rounded-xl p-3 font-semibold transition ${
                                    path.startsWith('/kontak')
                                        ? 'bg-[#e3f2fd] text-[#1976d2] dark:bg-sky-500/20 dark:text-sky-300'
                                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'
                                }`}
                            >
                                Kontak
                            </Link>
                        </li>

                        <li className="pt-3 border-t border-slate-100 dark:border-white/10">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2196f3] hover:bg-[#1976d2] p-3 text-center text-xs font-bold text-white shadow-md transition dark:bg-[#1976d2] dark:hover:bg-[#1565c0]"
                            >
                                <i className="bi bi-box-arrow-in-right text-base" />
                                <span>Login Sistem</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 dark:bg-[#050d24] dark:text-slate-100">{children}</main>

            {/* Footer UNPAM Royal Blue / Dark Midnight */}
            <footer className="border-t border-[#1976d2] bg-[#1565c0] py-8 text-center text-xs text-white/90 dark:border-white/10 dark:bg-[#030816] dark:text-slate-400">
                <div className="container mx-auto px-4">
                    <p>© {new Date().getFullYear()} Lembaga Layanan Disabilitas Universitas Pamulang. All rights reserved.</p>
                </div>
            </footer>

            {/* Accessibility Widget Floating Button & Panel */}
            <AccessibilityWidget />
        </div>
    );
}
