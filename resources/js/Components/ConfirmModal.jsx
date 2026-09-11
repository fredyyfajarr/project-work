import { useEffect } from 'react';

export default function ConfirmModal({
    isOpen = false,
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'danger', // 'danger' | 'warning' | 'info'
    onConfirm,
    onClose,
    loading = false,
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !loading) {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, loading]);

    if (!isOpen) return null;

    const iconMap = {
        danger: {
            icon: 'bi-trash3-fill',
            badgeBg: 'bg-red-50',
            badgeBorder: 'border-red-100',
            badgeText: 'text-red-600',
            btnBg: 'bg-red-600 hover:bg-red-700 shadow-red-500/25',
        },
        warning: {
            icon: 'bi-key-fill',
            badgeBg: 'bg-amber-50',
            badgeBorder: 'border-amber-100',
            badgeText: 'text-amber-600',
            btnBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25',
        },
        info: {
            icon: 'bi-arrow-repeat',
            badgeBg: 'bg-blue-50',
            badgeBorder: 'border-blue-100',
            badgeText: 'text-blue-600',
            btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25',
        },
    };

    const style = iconMap[type] || iconMap.danger;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
                onClick={() => {
                    if (!loading) onClose?.();
                }}
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
                {/* Icon Badge */}
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${style.badgeBorder} ${style.badgeBg} ${style.badgeText} text-2xl shadow-sm`}>
                    <i className={`bi ${style.icon}`} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{message}</p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`w-full rounded-xl ${style.btnBg} py-2.5 px-4 text-sm font-semibold text-white shadow-md active:scale-[0.99] transition cursor-pointer disabled:opacity-50`}
                    >
                        {loading ? 'Memproses...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
