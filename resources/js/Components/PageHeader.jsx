import { Link } from '@inertiajs/react';

export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">{title}</h2>
                {subtitle && <p className="mb-0 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
                {actions?.map((a, i) => a.href ? (
                    a.external || a.download ? (
                        <a key={i} href={a.href} target={a.target || undefined} download={a.download ? true : undefined} className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm ${a.variant === 'secondary' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : a.variant === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#2563eb] text-white hover:bg-blue-700'}`}>
                            {a.icon && <i className={`bi ${a.icon} mr-1.5`} />}{a.label}
                        </a>
                    ) : (
                        <Link key={i} href={a.href} className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm ${a.variant === 'secondary' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : a.variant === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#2563eb] text-white hover:bg-blue-700'}`}>
                            {a.icon && <i className={`bi ${a.icon} mr-1.5`} />}{a.label}
                        </Link>
                    )
                ) : (
                    <button key={i} onClick={a.onClick} className={`rounded-xl px-4 py-2 text-sm font-semibold ${a.variant === 'secondary' ? 'bg-slate-200 text-slate-700' : 'bg-[#2563eb] text-white'}`}>
                        {a.icon && <i className={`bi ${a.icon} mr-1`} />}{a.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
