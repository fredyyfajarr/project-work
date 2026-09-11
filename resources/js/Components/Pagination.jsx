import { Link } from '@inertiajs/react';

export default function Pagination({ links, paginator, from, to, total, page, totalPages, onChange, className = '' }) {
    const p = paginator && typeof paginator === 'object' ? paginator : {};
    const effectiveLinks = links || p.links || [];
    const effectiveFrom = from ?? p.from ?? null;
    const effectiveTo = to ?? p.to ?? null;
    const effectiveTotal = total ?? p.total ?? null;

    if (Array.isArray(effectiveLinks) && effectiveLinks.length > 0) {
        return (
            <div className={`mt-4 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row ${className}`}>
                {effectiveTotal !== null && (
                    <div className="text-xs text-slate-500">
                        Menampilkan <span className="font-semibold text-slate-700">{effectiveFrom ?? (effectiveTotal > 0 ? 1 : 0)}</span> - <span className="font-semibold text-slate-700">{effectiveTo ?? effectiveTotal}</span> dari <span className="font-semibold text-slate-700">{effectiveTotal}</span> data
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-1">
                    {effectiveLinks.map((l, i) => {
                        const rawLabel = String(l?.label || '');
                        const isPrev = rawLabel.includes('Previous') || rawLabel.includes('&laquo;') || rawLabel.includes('‹');
                        const isNext = rawLabel.includes('Next') || rawLabel.includes('&raquo;') || rawLabel.includes('›');
                        const labelText = isPrev ? '‹ Sebelumnya' : (isNext ? 'Berikutnya ›' : rawLabel);

                        return l.url ? (
                            <Link
                                key={i}
                                href={l.url}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                                    l.active
                                        ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#2563eb]'
                                }`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: labelText }} />
                            </Link>
                        ) : (
                            <span
                                key={i}
                                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs text-slate-300 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: labelText }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    if (totalPages && totalPages > 1) {
        const cur = page || 1;
        return (
            <div className={`mt-4 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row ${className}`}>
                {total !== undefined && (
                    <div className="text-xs text-slate-500">
                        Total <span className="font-semibold text-slate-700">{total}</span> data
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={cur <= 1}
                        onClick={() => onChange && onChange(cur - 1)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        ‹ Sebelumnya
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange && onChange(i + 1)}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                cur === i + 1
                                    ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#2563eb]'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        type="button"
                        disabled={cur >= totalPages}
                        onClick={() => onChange && onChange(cur + 1)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Berikutnya ›
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
