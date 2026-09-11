const MAP = {
    aktif: 'bg-green-100 text-green-700',
    lulus: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    menunggu: 'bg-yellow-100 text-yellow-700',
    diterima: 'bg-green-100 text-green-700',
    disetujui: 'bg-green-100 text-green-700',
    valid: 'bg-green-100 text-green-700',
    ditolak: 'bg-red-100 text-red-700',
    cuti: 'bg-yellow-100 text-yellow-700',
    nonaktif: 'bg-red-100 text-red-700',
    aman: 'bg-green-100 text-green-700',
    bermasalah: 'bg-red-100 text-red-700',
    dikirim: 'bg-blue-100 text-blue-700',
    diajukan: 'bg-blue-100 text-blue-700',
    diproses: 'bg-amber-100 text-amber-700',
    selesai: 'bg-emerald-100 text-emerald-700',
    dibaca: 'bg-slate-200 text-slate-700',
};

export default function Badge({ status = '-', className = '' }) {
    const key = String(status || '-').toLowerCase();
    const color = MAP[key] || 'bg-slate-100 text-slate-600';
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${color} ${className}`}>
            {String(status).toUpperCase()}
        </span>
    );
}
