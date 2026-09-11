import { useMemo, useState } from 'react';
import EmptyState from './EmptyState';

// Tiru table.blade.php: search + pagination.
// columns: [{ key, label, render?(row), className? }]
export default function DataTable({
    columns = [],
    data = [],
    searchable = true,
    paginate = true,
    perPage = 10,
    placeholder = 'Cari data...',
    emptyTitle = 'Belum ada data',
}) {
    const rows = Array.isArray(data) ? data : [];
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(perPage);

    const filtered = useMemo(() => {
        if (!q) return rows;
        const needle = q.toLowerCase();
        return rows.filter((r) => columns.some((c) => {
            const v = c.key ? r?.[c.key] : '';
            return String(v ?? '').toLowerCase().includes(needle);
        }));
    }, [rows, q, columns]);

    const totalRows = filtered.length;
    const effectivePerPage = Math.max(1, Number(pageSize) || 10);
    const totalPages = Math.max(1, Math.ceil(totalRows / effectivePerPage));
    const cur = Math.min(page, totalPages);

    const slice = paginate
        ? filtered.slice((cur - 1) * effectivePerPage, cur * effectivePerPage)
        : filtered;

    const from = totalRows === 0 ? 0 : (cur - 1) * effectivePerPage + 1;
    const to = Math.min(cur * effectivePerPage, totalRows);

    return (
        <div>
            {searchable && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={q}
                            onChange={(e) => { setQ(e.target.value); setPage(1); }}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#2563eb]"
                        />
                    </div>
                    {paginate && totalRows > 10 && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span>Tampilkan</span>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>data</span>
                        </div>
                    )}
                </div>
            )}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full min-w-[640px] align-middle text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-left text-slate-500">
                            {columns.map((c) => (
                                <th key={c.key || c.label} className={`px-4 py-3 font-semibold ${c.className || ''}`}>{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {slice.map((row, i) => (
                            <tr key={row.id || row.idMahasiswa || row.idUser || row.idCms || row.idLuaran || row.idAkademik || i} className="border-t border-slate-100 hover:bg-blue-50/40">
                                {columns.map((c) => (
                                    <td key={c.key || c.label} className={`px-4 py-3 ${c.className || ''}`}>
                                        {c.render ? c.render(row) : (row?.[c.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {slice.length === 0 && (
                            <tr><td colSpan={columns.length} className="px-4 py-6"><EmptyState title={emptyTitle} message="Data tidak ditemukan atau belum tersedia." /></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {paginate && totalRows > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
                    <div className="text-xs text-slate-500">
                        Menampilkan <span className="font-semibold text-slate-700">{from}</span> - <span className="font-semibold text-slate-700">{to}</span> dari <span className="font-semibold text-slate-700">{totalRows}</span> data
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={cur <= 1}
                                onClick={() => setPage(cur - 1)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                ‹ Sebelumnya
                            </button>
                            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setPage(i + 1)}
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
                                onClick={() => setPage(cur + 1)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Berikutnya ›
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
