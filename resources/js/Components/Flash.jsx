import { useEffect, useState } from 'react';

let toastEmitter = null;

export function showToast(toast) {
    if (toastEmitter) {
        toastEmitter(toast);
    }
}

export default function Flash({ success, error, errors }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Date.now() + Math.random();
        const newToast = { id, ...toast };
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4500);
    };

    useEffect(() => {
        toastEmitter = addToast;
        return () => {
            toastEmitter = null;
        };
    }, []);

    useEffect(() => {
        if (success) {
            addToast({
                type: 'success',
                title: 'Berhasil',
                message: success,
            });
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            addToast({
                type: 'error',
                title: 'Terjadi Kesalahan',
                message: error,
            });
        }
    }, [error]);

    useEffect(() => {
        const list = errors && typeof errors === 'object' ? Object.values(errors) : [];
        if (list.length > 0) {
            addToast({
                type: 'error',
                title: 'Validasi Belum Lengkap',
                message: list.join(', '),
            });
        }
    }, [errors]);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm w-[90vw] sm:w-[380px] pointer-events-none">
            {toasts.map((t) => {
                const isSuccess = t.type === 'success';
                return (
                    <div
                        key={t.id}
                        className="pointer-events-auto relative overflow-hidden rounded-2xl bg-white p-4 shadow-2xl border border-slate-100 flex items-start gap-3.5 transition-all duration-200 animate-in slide-in-from-top-4 fade-in"
                    >
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg border shadow-xs ${
                                isSuccess
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}
                        >
                            <i className={`bi ${isSuccess ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
                        </div>

                        <div className="flex-1 pr-3">
                            <h5 className="text-sm font-bold text-slate-900 leading-tight">{t.title}</h5>
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">{t.message}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeToast(t.id)}
                            className="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                            aria-label="Tutup notifikasi"
                        >
                            <i className="bi bi-x-lg text-xs" />
                        </button>

                        {/* Animated progress line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                            <div
                                className={`h-full ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{
                                    animation: 'shrinkToast 4.5s linear forwards',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

