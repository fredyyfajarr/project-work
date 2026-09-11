import { useEffect, useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { route } from '../lib/route';
import Flash from '../Components/Flash';
import ConfirmModal from '../Components/ConfirmModal';
import { registerConfirmHandler } from '../lib/confirm';
import AccessibilityWidget from '../Components/AccessibilityWidget';

const ROLE_LABELS = {
    admin: 'Administrator',
    ketua: 'Kepala Lembaga',
    staff: 'Kepala Bidang Viktor',
    staff_serang: 'Kepala Bidang Serang',
    mahasiswa: 'Mahasiswa',
    alumni: 'Alumni',
};

const ADMIN_MENU_GROUPS = [
    {
        category: 'UTAMA',
        items: [
            { label: 'Dashboard', icon: 'bi-grid', href: '/admin', match: (p) => p === '/admin', roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
        ]
    },
    {
        category: 'DATA & AKADEMIK',
        items: [
            { label: 'Mahasiswa', icon: 'bi-people', href: '/admin/mahasiswa', match: (p) => p.startsWith('/admin/mahasiswa'), roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
            { label: 'Kelola Akademik', icon: 'bi-book', href: '/admin/akademik', match: (p) => p.startsWith('/admin/akademik'), roles: ['admin'] },
            { label: 'Validasi Luaran', icon: 'bi-award', href: '/admin/luaran', match: (p) => p.startsWith('/admin/luaran'), roles: ['admin', 'staff', 'staff_serang'] },
            { label: 'Kelola Beasiswa', icon: 'bi-cash-coin', href: '/admin/beasiswa', match: (p) => p.startsWith('/admin/beasiswa'), roles: ['admin', 'staff'] },
            { label: 'Data Alumni & Tracer', icon: 'bi-mortarboard', href: '/admin/alumni', match: (p) => p.startsWith('/admin/alumni'), roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
        ]
    },
    {
        category: 'MONITORING & LAYANAN',
        items: [
            { label: 'Monitoring Akademik', icon: 'bi-bar-chart', href: '/admin/monitoring', match: (p) => p === '/admin/monitoring' || p.startsWith('/admin/monitoring/'), roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
            { label: 'Monitoring Jadwal', icon: 'bi-calendar-week', href: '/admin/monitoring-jadwal', match: (p) => p.startsWith('/admin/monitoring-jadwal'), roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
            { label: 'Monitoring Aspirasi', icon: 'bi-chat-left-text', href: '/admin/monitoring-aspirasi', match: (p) => p.startsWith('/admin/monitoring-aspirasi'), roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
            { label: 'Nomor Surat', icon: 'bi-envelope', href: '/admin/nomor-surat', match: (p) => p.startsWith('/admin/nomor-surat'), roles: ['admin'] },
            { label: 'Kelola Laporan', icon: 'bi-file-earmark-text', href: '/admin/laporan', match: (p) => p.startsWith('/admin/laporan'), roles: ['admin', 'ketua', 'staff', 'staff_serang'] },
        ]
    },
    {
        category: 'SISTEM & CMS',
        items: [
            { label: 'Kelola User', icon: 'bi-person-gear', href: '/admin/user', match: (p) => p.startsWith('/admin/user'), roles: ['admin'] },
            { label: 'Permohonan Reset', icon: 'bi-key', href: '/admin/permohonan-reset', match: (p) => p.startsWith('/admin/permohonan-reset'), roles: ['admin'], hasBadge: true },
            { label: 'Kelola CMS', icon: 'bi-gear', href: '/admin/cms', match: (p) => p.startsWith('/admin/cms'), roles: ['admin'] },
        ]
    }
];

const MHS_MENU_GROUPS = [
    {
        category: 'UTAMA',
        items: [
            { label: 'Dashboard', icon: 'bi-grid-1x2-fill', href: '/mahasiswa' },
        ]
    },
    {
        category: 'AKADEMIK & KEGIATAN',
        items: [
            { label: 'Akademik', icon: 'bi-graph-up-arrow', href: '/mahasiswa/akademik' },
            { label: 'Luaran', icon: 'bi-award-fill', href: '/mahasiswa/luaran' },
            { label: 'Kelola Jadwal', icon: 'bi-calendar-week-fill', href: '/mahasiswa/jadwal' },
        ]
    },
    {
        category: 'LAYANAN & AKUN',
        items: [
            { label: 'Beasiswa', icon: 'bi-cash-coin', href: '/mahasiswa/beasiswa' },
            { label: 'Aspirasi', icon: 'bi-chat-left-text-fill', href: '/mahasiswa/aspirasi' },
            { label: 'Profil', icon: 'bi-person-badge-fill', href: '/mahasiswa/profil' },
        ]
    }
];

const ALUMNI_MENU_GROUPS = [
    {
        category: 'UTAMA',
        items: [
            { label: 'Dashboard Alumni', icon: 'bi-grid-1x2-fill', href: '/alumni' },
        ]
    },
    {
        category: 'TRACER & EVALUASI',
        items: [
            { label: 'Tracer Study', icon: 'bi-briefcase-fill', href: '/alumni/tracer-study' },
            { label: 'Aspirasi Alumni', icon: 'bi-chat-left-text-fill', href: '/alumni/aspirasi' },
        ]
    },
    {
        category: 'PENGATURAN AKUN',
        items: [
            { label: 'Profil Alumni', icon: 'bi-person-badge-fill', href: '/alumni/profil' },
        ]
    }
];

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth, flash, pendingResetCount = 0 } = usePage().props;
    const user = auth?.user || null;
    const role = user?.role || 'admin';
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [confirmState, setConfirmState] = useState({ isOpen: false });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        registerConfirmHandler((options) => {
            return new Promise((resolve) => {
                setConfirmState({
                    isOpen: true,
                    ...options,
                    onConfirm: () => {
                        setConfirmState((prev) => ({ ...prev, isOpen: false }));
                        if (options.onConfirm) options.onConfirm();
                        resolve(true);
                    },
                    onClose: () => {
                        setConfirmState((prev) => ({ ...prev, isOpen: false }));
                        if (options.onCancel) options.onCancel();
                        resolve(false);
                    },
                });
            });
        });
    }, []);

    const isAlumni = role === 'alumni' || (role === 'mahasiswa' && String(user?.mahasiswa?.status).toLowerCase() === 'lulus');
    const isMhs = role === 'mahasiswa' && !isAlumni;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    // Auto-close drawers/menus on route change
    useEffect(() => {
        setOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    let menuGroups = [];
    if (isAlumni) {
        menuGroups = ALUMNI_MENU_GROUPS.map((grp) => ({
            category: grp.category,
            items: grp.items.map((m) => ({ ...m, active: pathname === m.href })),
        }));
    } else if (isMhs) {
        menuGroups = MHS_MENU_GROUPS.map((grp) => ({
            category: grp.category,
            items: grp.items.map((m) => ({ ...m, active: pathname === m.href })),
        }));
    } else {
        menuGroups = ADMIN_MENU_GROUPS.map((grp) => ({
            category: grp.category,
            items: grp.items
                .filter((m) => m.roles.includes(role))
                .map((m) => ({ ...m, active: m.match(pathname) })),
        })).filter((grp) => grp.items.length > 0);
    }

    const logout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const handleHamburger = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    };

    const submitChangePassword = (e) => {
        e.preventDefault();
        const targetUrl = isMhs ? '/mahasiswa/ganti-password' : '/admin/ganti-password';
        passwordForm.post(targetUrl, {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setShowPasswordModal(false);
            },
        });
    };

    const fullName = user?.mahasiswa?.nama || user?.username || 'Pengguna';
    const userIdentifier = user?.mahasiswa?.nim || user?.username || '-';
    const isCompact = collapsed;

    const renderSidebarContent = (isDrawer = false) => {
        const compact = isCompact && !isDrawer;

        return (
            <div className="flex h-full flex-col px-3 py-4 bg-white dark:bg-slate-900 overflow-hidden">
                {/* Profile Box */}
                {!compact ? (
                    <div className="mb-4 flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-white/10">
                        <div className="relative mb-2">
                            <div className="h-16 w-16 rounded-full ring-3 ring-[#2196f3] p-0.5 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-xs">
                                <img
                                    src="/assets/Logo LLD.png"
                                    alt="Avatar"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                        <div className="w-full px-2">
                            <div className="text-xs sm:text-sm font-black tracking-tight text-slate-800 dark:text-white uppercase truncate" title={fullName}>
                                {fullName}
                            </div>
                            <div className="mt-0.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span>{userIdentifier}</span>
                                <i className="bi bi-patch-check-fill text-emerald-500 text-sm" title="Akun Terverifikasi" />
                            </div>
                            <span className="mt-1.5 inline-block rounded-full bg-sky-50 dark:bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-[#1976d2] dark:text-sky-300 uppercase tracking-wider">
                                {ROLE_LABELS[role] || String(role).replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 flex flex-col items-center pb-3 border-b border-slate-100 dark:border-white/10">
                        <div className="h-10 w-10 rounded-full ring-2 ring-[#2196f3] p-0.5 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-xs" title={fullName}>
                            <img src="/assets/Logo LLD.png" alt="LLD" className="h-full w-full object-contain" />
                        </div>
                    </div>
                )}

                {/* Nav Menu */}
                <nav className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {menuGroups.map((grp) => (
                        <div key={grp.category}>
                            {!compact && (
                                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {grp.category}
                                </div>
                            )}
                            <div className="space-y-1">
                                {grp.items.map((m) => (
                                    <Link
                                        key={m.label}
                                        href={m.href}
                                        onClick={() => isDrawer && setOpen(false)}
                                        title={compact ? m.label : undefined}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition duration-150 relative ${
                                            compact ? 'justify-center' : ''
                                        } ${
                                            m.active
                                                ? 'bg-[#e3f2fd] text-[#1976d2] dark:bg-sky-500/20 dark:text-sky-300 font-bold shadow-xs'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium'
                                        }`}
                                    >
                                        <i className={`bi ${m.icon} text-[16px] shrink-0 ${m.active ? 'text-[#2196f3] dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} />
                                        {!compact && <span className="truncate">{m.label}</span>}
                                        {m.hasBadge && pendingResetCount > 0 && (
                                            <span
                                                className={`rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse ${
                                                    compact
                                                        ? 'absolute -top-1 -right-1 h-4 w-4'
                                                        : 'ml-auto px-1.5 py-0.2'
                                                }`}
                                                title={`${pendingResetCount} permohonan reset menunggu ACC`}
                                            >
                                                {pendingResetCount}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <hr className="my-2 border-slate-100 dark:border-white/10" />
                <div className="mt-auto space-y-1">
                    <button
                        onClick={() => {
                            if (isDrawer) setOpen(false);
                            setShowPasswordModal(true);
                        }}
                        title={compact ? 'Ganti Kata Sandi' : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1976d2] dark:hover:text-sky-300 cursor-pointer ${
                            compact ? 'justify-center' : ''
                        }`}
                    >
                        <i className="bi bi-shield-lock text-[16px] text-blue-500 dark:text-sky-400 shrink-0" />
                        {!compact && <span>Ganti Password</span>}
                    </button>
                    <button
                        onClick={logout}
                        title={compact ? 'Logout' : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-red-50 dark:hover:bg-rose-950/40 hover:text-red-600 dark:hover:text-rose-400 cursor-pointer ${
                            compact ? 'justify-center' : ''
                        }`}
                    >
                        <i className="bi bi-box-arrow-right text-[16px] text-red-500 shrink-0" />
                        {!compact && <span>Logout</span>}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#eef5fb] font-sans text-slate-800 dark:bg-[#050d24] dark:text-slate-100 transition-colors duration-300">
            {/* Modal Dialog Konfirmasi Custom */}
            <ConfirmModal {...confirmState} />

            {/* Modal Ganti Password Global */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setShowPasswordModal(false)}
                    />
                    <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 border border-slate-100 dark:border-white/10 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <i className="bi bi-shield-lock-fill text-[#2196f3] text-xl" />
                                <h3 className="text-base font-bold text-slate-800 dark:text-white">Ganti Kata Sandi</h3>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition cursor-pointer"
                            >
                                <i className="bi bi-x-lg text-base leading-none" />
                            </button>
                        </div>

                        <form onSubmit={submitChangePassword} className="mt-4 space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Kata Sandi Saat Ini</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showCurrentPass ? 'text' : 'password'}
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        placeholder="Masukkan kata sandi saat ini"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2196f3] focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <i className={`bi ${showCurrentPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                                    </button>
                                </div>
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-xs text-rose-500 font-medium">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Kata Sandi Baru</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showNewPass ? 'text' : 'password'}
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2196f3] focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <i className={`bi ${showNewPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                                    </button>
                                </div>
                                {passwordForm.errors.password && (
                                    <p className="mt-1 text-xs text-rose-500 font-medium">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Konfirmasi Kata Sandi Baru</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showNewPass ? 'text' : 'password'}
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi kata sandi baru"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2196f3] focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                                    />
                                </div>
                                {passwordForm.errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-rose-500 font-medium">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="rounded-xl bg-[#2196f3] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1976d2] transition disabled:opacity-50 cursor-pointer"
                                >
                                    {passwordForm.processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar desktop */}
            <aside
                className={`fixed left-0 top-0 hidden h-screen overflow-hidden bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-white/10 md:block shadow-sm z-20 transition-all duration-200 ${
                    collapsed ? 'w-[72px]' : 'w-[260px]'
                }`}
            >
                {renderSidebarContent(false)}
            </aside>

            {/* Sidebar mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/80">
                            <div className="flex items-center gap-2">
                                <img src="/assets/Logo LLD.png" alt="LLD" className="h-7 w-7 object-contain" />
                                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">LLD UNPAM</span>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                                aria-label="Tutup menu"
                            >
                                <i className="bi bi-x-lg text-base leading-none" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {renderSidebarContent(true)}
                        </div>
                    </aside>
                </div>
            )}

            {/* Content Area */}
            <div className={`transition-all duration-200 ${collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'}`}>
                {/* Topbar UNPAM Blue persis My Unpam */}
                <header className="sticky top-0 z-10 bg-gradient-to-r from-[#1e88e5] to-[#2196f3] dark:from-[#0d47a1] dark:to-[#1565c0] px-3 sm:px-4 py-3.5 shadow-md md:px-8 text-white">
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <button
                                className="rounded-lg p-1.5 text-white hover:bg-white/15 transition cursor-pointer shrink-0"
                                onClick={handleHamburger}
                                aria-label="Menu navigasi"
                                title="Buka/Tutup Menu"
                            >
                                <i className="bi bi-list text-2xl leading-none" />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-xs sm:text-base md:text-lg font-extrabold tracking-wide uppercase text-white truncate">
                                    UNIVERSITAS PAMULANG
                                </h1>
                                <p className="text-[10px] sm:text-xs text-white/90 font-medium truncate">
                                    {title} — <span className="text-white/80">Lembaga Layanan Disabilitas</span>
                                </p>
                            </div>
                        </div>

                        {/* Topbar Right Controls & User Dropdown */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/25 transition cursor-pointer"
                            >
                                <i className="bi bi-person-circle text-sm text-white" />
                                <span className="hidden sm:inline max-w-[120px] truncate">{user?.username || '-'}</span>
                                <i className={`bi bi-chevron-down text-[10px] transition duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-100 dark:border-white/10 z-40 text-slate-800 dark:text-slate-100">
                                        <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                                            <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{fullName}</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{user?.email || userIdentifier}</div>
                                            <span className="mt-1 inline-block rounded-full bg-sky-50 dark:bg-sky-500/20 px-2 py-0.5 text-[9px] font-bold text-[#1976d2] dark:text-sky-300 uppercase">
                                                {ROLE_LABELS[role] || role}
                                            </span>
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    setShowPasswordModal(true);
                                                }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-sky-300 transition cursor-pointer"
                                            >
                                                <i className="bi bi-shield-lock text-sm text-blue-500 dark:text-sky-400" />
                                                <span>Ganti Password</span>
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                            >
                                                <i className="bi bi-box-arrow-right text-sm text-rose-500 dark:text-rose-400" />
                                                <span>Keluar (Logout)</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-3 sm:p-4 md:p-8">
                    <Flash success={flash?.success} error={flash?.error} />
                    {children}
                </main>
            </div>

            {/* Accessibility Widget Floating Button & Panel */}
            <AccessibilityWidget />
        </div>
    );
}
