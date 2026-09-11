import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../lib/theme';

const STORAGE_KEY = 'lld_accessibility_settings';

const DEFAULT_SETTINGS = {
    fontSize: 100, // 100, 115, 130, 145
    contrast: 'normal', // 'normal', 'high-contrast', 'grayscale', 'invert'
    textSpacing: false,
    dyslexiaFont: false,
    highlightLinks: false,
    bigCursor: false,
};

export default function AccessibilityWidget() {
    const { theme, isDark, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const panelRef = useRef(null);

    // Muat daftar suara untuk Text-to-Speech
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const updateVoices = () => {
                setVoices(window.speechSynthesis.getVoices());
            };
            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, []);

    // Terapkan pengaturan ke DOM
    const applySettings = useCallback((newSettings) => {
        const root = document.documentElement;

        // 1. Ukuran Font
        if (newSettings.fontSize === 100) {
            root.style.fontSize = '';
        } else {
            root.style.fontSize = `${newSettings.fontSize}%`;
        }

        // 2. Kontras
        root.classList.remove('acc-high-contrast', 'acc-grayscale', 'acc-invert');
        if (newSettings.contrast === 'high-contrast') {
            root.classList.add('acc-high-contrast');
        } else if (newSettings.contrast === 'grayscale') {
            root.classList.add('acc-grayscale');
        } else if (newSettings.contrast === 'invert') {
            root.classList.add('acc-invert');
        }

        // 3. Spasi Teks
        root.classList.toggle('acc-text-spacing', Boolean(newSettings.textSpacing));

        // 4. Font Ramah Disleksia
        root.classList.toggle('acc-dyslexia', Boolean(newSettings.dyslexiaFont));

        // 5. Sorot Tautan
        root.classList.toggle('acc-highlight-links', Boolean(newSettings.highlightLinks));

        // 6. Kursor Besar
        root.classList.toggle('acc-big-cursor', Boolean(newSettings.bigCursor));

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        } catch (e) {
            // ignore
        }
    }, []);

    // Terapkan saat inisialisasi dan saat settings berubah
    useEffect(() => {
        applySettings(settings);
    }, [settings, applySettings]);

    // Keyboard Shortcuts: Alt + A untuk buka/tutup, Escape untuk tutup
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                setOpen((prev) => !prev);
            } else if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    // Tutup panel bila klik di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.acc-trigger-btn')) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Text-to-Speech Helpers
    const speak = (text) => {
        if (!('speechSynthesis' in window) || !text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        // Prioritaskan suara Bahasa Indonesia
        const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang === 'id-ID') || voices[0];
        if (idVoice) utterance.voice = idVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const readSelectedText = () => {
        const selection = window.getSelection()?.toString()?.trim();
        if (selection) {
            speak(selection);
        } else {
            speak('Silakan pilih atau sorot teks di layar yang ingin Anda dengarkan.');
        }
    };

    const readPageContent = () => {
        const main = document.querySelector('main') || document.body;
        const headings = Array.from(main.querySelectorAll('h1, h2, h3, p'))
            .map((el) => el.innerText.trim())
            .filter((t) => t.length > 0)
            .slice(0, 15)
            .join('. ');

        if (headings) {
            speak(headings);
        } else {
            speak(document.title || 'Halaman Layanan Disabilitas Universitas Pamulang');
        }
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        stopSpeaking();
    };

    const activeCount = [
        settings.fontSize !== 100,
        settings.contrast !== 'normal',
        settings.textSpacing,
        settings.dyslexiaFont,
        settings.highlightLinks,
        settings.bigCursor,
    ].filter(Boolean).length;

    return (
        <div className="acc-control-ignore">
            {/* FLOATING TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="acc-trigger-btn fixed bottom-5 right-5 z-40 flex h-12 w-12 sm:h-12.5 sm:w-12.5 items-center justify-center rounded-full bg-[#2196f3] hover:bg-[#1976d2] text-white shadow-xl shadow-blue-500/35 ring-4 ring-white dark:ring-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#90caf9]"
                aria-label="Buka Menu Aksesibilitas Disabilitas (Pintasan: Alt + A)"
                title="Pusat Aksesibilitas Ramah Disabilitas (Alt + A)"
            >
                {/* Ikon Universal Access */}
                <i className="bi bi-universal-access text-2xl font-bold leading-none" />

                {/* Badge Penanda Fitur Aktif */}
                {activeCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-slate-900 shadow-md">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* FLOATING ACCESSIBILITY PANEL MODAL / DRAWER */}
            {open && (
                <div
                    ref={panelRef}
                    className="acc-control-panel fixed bottom-18 sm:bottom-19 right-3 sm:right-5 z-50 w-[92vw] max-w-[360px] rounded-3xl border border-slate-200/90 bg-white/95 p-4 text-slate-800 shadow-2xl backdrop-blur-xl sm:w-[360px] dark:bg-slate-900/95 dark:border-white/10 dark:text-slate-100"
                    role="dialog"
                    aria-label="Panel Pengaturan Aksesibilitas"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/10">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e3f2fd] text-[#1976d2] dark:bg-sky-500/20 dark:text-sky-300">
                                <i className="bi bi-universal-access text-lg" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 leading-tight dark:text-white">Pusat Aksesibilitas</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Fitur ramah disabilitas LLD</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {activeCount > 0 && (
                                <button
                                    type="button"
                                    onClick={resetSettings}
                                    className="rounded-lg px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer dark:text-rose-400 dark:hover:bg-rose-950/40"
                                    title="Kembalikan ke pengaturan awal"
                                >
                                    Reset
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition dark:hover:bg-white/10 dark:hover:text-white"
                                aria-label="Tutup Panel"
                            >
                                <i className="bi bi-x-lg text-sm" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 max-h-[58vh] sm:max-h-[400px] space-y-3 overflow-y-auto pr-1 text-xs">
                        {/* 1. PILIHAN TEMA UTAMA (DUAL THEME) */}
                        <div>
                            <div className="mb-2 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                                <span className="flex items-center gap-1.5">
                                    <i className="bi bi-palette-fill text-[#2196f3] dark:text-sky-400" /> Tema Portal
                                </span>
                                <span className="text-[11px] font-bold text-[#1976d2] dark:text-sky-300">
                                    {isDark ? 'Dark Midnight' : 'Light Academic'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center justify-center gap-2 rounded-xl p-2.5 font-bold text-xs transition cursor-pointer border ${
                                        !isDark
                                            ? 'border-[#2196f3] bg-[#e3f2fd] text-[#1976d2] ring-2 ring-blue-500/20 shadow-xs'
                                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <i className="bi bi-sun-fill text-amber-500" />
                                    <span>Light Academic</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center justify-center gap-2 rounded-xl p-2.5 font-bold text-xs transition cursor-pointer border ${
                                        isDark
                                            ? 'border-sky-400 bg-sky-950/60 text-sky-300 ring-2 ring-sky-400/30 shadow-xs'
                                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <i className="bi bi-moon-stars-fill text-sky-400" />
                                    <span>Dark Midnight</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. UKURAN TEKS */}
                        <div>
                            <div className="mb-2 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                                <span className="flex items-center gap-1.5">
                                    <i className="bi bi-type text-[#2196f3] dark:text-sky-400" /> Ukuran Teks
                                </span>
                                <span className="font-mono text-[#1976d2] dark:text-sky-300 font-bold">{settings.fontSize}%</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                                {[
                                    { label: 'Normal', val: 100 },
                                    { label: '+15%', val: 115 },
                                    { label: '+30%', val: 130 },
                                    { label: '+45%', val: 145 },
                                ].map((item) => (
                                    <button
                                        key={item.val}
                                        type="button"
                                        onClick={() => setSettings((s) => ({ ...s, fontSize: item.val }))}
                                        className={`rounded-xl py-2 font-semibold transition cursor-pointer text-center ${
                                            settings.fontSize === item.val
                                                ? 'bg-[#2196f3] text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. MODE KONTRAS & WARNA */}
                        <div>
                            <div className="mb-2 font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                <i className="bi bi-circle-half text-[#2196f3] dark:text-sky-400" /> Filter Kontras Disabilitas
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'normal', label: 'Standar', icon: 'bi-brightness-high', bg: 'bg-slate-100 dark:bg-slate-800/80 dark:text-slate-200' },
                                    { id: 'high-contrast', label: 'Kontras Tinggi', icon: 'bi-moon-stars-fill', bg: 'bg-black text-yellow-300 border-yellow-400' },
                                    { id: 'grayscale', label: 'Monokrom', icon: 'bi-palette', bg: 'bg-slate-300 text-slate-900' },
                                    { id: 'invert', label: 'Invert Layar', icon: 'bi-sun-fill', bg: 'bg-slate-800 text-slate-100' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSettings((s) => ({ ...s, contrast: item.id }))}
                                        className={`flex items-center gap-2 rounded-xl p-2.5 font-semibold text-[11px] transition cursor-pointer border ${
                                            settings.contrast === item.id
                                                ? 'border-[#2196f3] ring-2 ring-blue-500/20'
                                                : 'border-slate-200 dark:border-white/10 hover:border-slate-300'
                                        } ${item.bg}`}
                                    >
                                        <i className={`bi ${item.icon}`} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. ALAT BANTU BACA & NAVIGASI */}
                        <div>
                            <div className="mb-2 font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                <i className="bi bi-eye text-[#2196f3] dark:text-sky-400" /> Bantuan Visual & Baca
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSettings((s) => ({ ...s, textSpacing: !s.textSpacing }))}
                                    className={`flex items-center justify-between rounded-xl p-2.5 font-medium transition cursor-pointer border ${
                                        settings.textSpacing
                                            ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-400'
                                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>Spasi Teks</span>
                                    <i className={`bi ${settings.textSpacing ? 'bi-check-circle-fill text-blue-600 dark:text-sky-400' : 'bi-dash'}`} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSettings((s) => ({ ...s, dyslexiaFont: !s.dyslexiaFont }))}
                                    className={`flex items-center justify-between rounded-xl p-2.5 font-medium transition cursor-pointer border ${
                                        settings.dyslexiaFont
                                            ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-400'
                                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>Font Disleksia</span>
                                    <i className={`bi ${settings.dyslexiaFont ? 'bi-check-circle-fill text-blue-600 dark:text-sky-400' : 'bi-dash'}`} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSettings((s) => ({ ...s, highlightLinks: !s.highlightLinks }))}
                                    className={`flex items-center justify-between rounded-xl p-2.5 font-medium transition cursor-pointer border ${
                                        settings.highlightLinks
                                            ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-400'
                                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>Sorot Tautan</span>
                                    <i className={`bi ${settings.highlightLinks ? 'bi-check-circle-fill text-blue-600 dark:text-sky-400' : 'bi-dash'}`} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSettings((s) => ({ ...s, bigCursor: !s.bigCursor }))}
                                    className={`flex items-center justify-between rounded-xl p-2.5 font-medium transition cursor-pointer border ${
                                        settings.bigCursor
                                            ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-400'
                                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>Kursor Besar</span>
                                    <i className={`bi ${settings.bigCursor ? 'bi-check-circle-fill text-blue-600 dark:text-sky-400' : 'bi-dash'}`} />
                                </button>
                            </div>
                        </div>

                        {/* 5. SUARA / TEXT-TO-SPEECH (Bantuan Disabilitas Netra) */}
                        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3 dark:border-white/10 dark:bg-slate-800/60">
                            <div className="mb-2 flex items-center justify-between font-semibold text-sky-900 dark:text-sky-300">
                                <span className="flex items-center gap-1.5">
                                    <i className="bi bi-megaphone-fill text-[#2196f3] dark:text-sky-400" /> Suara Layar (TTS)
                                </span>
                                {isSpeaking && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sedang Membaca
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <button
                                    type="button"
                                    onClick={readSelectedText}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-white p-2 text-slate-800 font-semibold shadow-xs hover:bg-sky-100/50 transition cursor-pointer border border-sky-200 dark:bg-slate-900 dark:border-white/10 dark:text-slate-100 dark:hover:bg-slate-800"
                                >
                                    <i className="bi bi-cursor-text text-[#2196f3] dark:text-sky-400" />
                                    <span>Baca Teks yang Disorot</span>
                                </button>
                                <div className="flex gap-1.5">
                                    <button
                                        type="button"
                                        onClick={readPageContent}
                                        disabled={isSpeaking}
                                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2196f3] hover:bg-[#1976d2] p-2 text-white font-semibold transition cursor-pointer disabled:opacity-50"
                                    >
                                        <i className="bi bi-volume-up" />
                                        <span>Baca Halaman</span>
                                    </button>
                                    {isSpeaking && (
                                        <button
                                            type="button"
                                            onClick={stopSpeaking}
                                            className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-white font-semibold hover:bg-rose-700 transition cursor-pointer"
                                            title="Hentikan Suara"
                                        >
                                            <i className="bi bi-stop-fill" />
                                            <span>Stop</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-white/10 dark:text-slate-500">
                        <span>Pintasan Cepat: <b>Alt + A</b></span>
                        <span>LLD UNPAM Inklusif</span>
                    </div>
                </div>
            )}
        </div>
    );
}
