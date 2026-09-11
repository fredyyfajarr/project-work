import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lld_theme';

export function getTheme() {
    if (typeof window === 'undefined') return 'light';
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

export function setTheme(theme) {
    if (typeof window === 'undefined') return;
    const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    try {
        localStorage.setItem(STORAGE_KEY, resolvedTheme);
    } catch {
        // ignore
    }

    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    window.dispatchEvent(new CustomEvent('lld-theme-change', { detail: resolvedTheme }));
}

export function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

export function useTheme() {
    const [theme, setLocalTheme] = useState(() => getTheme());

    useEffect(() => {
        const handleThemeChange = (e) => {
            const nextTheme = e?.detail || getTheme();
            setLocalTheme(nextTheme);
        };

        const handleStorage = (e) => {
            if (e.key === STORAGE_KEY) {
                setLocalTheme(getTheme());
            }
        };

        window.addEventListener('lld-theme-change', handleThemeChange);
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('lld-theme-change', handleThemeChange);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    const toggle = useCallback(() => {
        return toggleTheme();
    }, []);

    const set = useCallback((t) => {
        setTheme(t);
    }, []);

    return { theme, isDark: theme === 'dark', toggleTheme: toggle, setTheme: set };
}
