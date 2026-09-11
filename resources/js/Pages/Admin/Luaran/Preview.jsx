import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import Badge from '../../../Components/Badge';
import { route } from '../../../lib/route';

export default function Preview({ preview = [] }) {
    const rows = Array.isArray(preview) ? preview : [];
    const form = useForm({});
    const confirm = (e) => {
        e.preventDefault();
        form.post(route('admin.luaran.import'));
    };
    return (
        <AdminLayout title="Preview Import Luaran">
            <PageHeader
                title="Preview Import Luaran"
                subtitle="Periksa data sebelum diimport ke database."
                actions={[{ label: 'Kembali', href: route('admin.luaran.index'), variant: 'secondary' }]}
            />
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full min-w-[880px] align-middle text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-slate-500">
                                <th className="px-4 py-3 font-semibold">No</th>
                                <th className="px-4 py-3 font-semibold">NIM</th>
                                <th className="px-4 py-3 font-semibold">Judul</th>
                                <th className="px-4 py-3 font-semibold">Jenis</th>
                                <th className="px-4 py-3 font-semibold">Tingkat</th>
                                <th className="px-4 py-3 font-semibold">Tahun</th>
                                <th className="px-4 py-3 font-semibold">Deskripsi</th>
                                <th className="px-4 py-3 font-semibold">File Bukti</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((p, i) => (
                                <tr key={i} className={`border-t border-slate-100 ${!p?.valid ? 'bg-red-50/60' : p?.duplicate ? 'bg-yellow-50/60' : ''}`}>
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3">{p?.nim || '-'}</td>
                                    <td className="px-4 py-3">{p?.judul || '-'}</td>
                                    <td className="px-4 py-3">{p?.jenisLuaran || '-'}</td>
                                    <td className="px-4 py-3">{p?.tingkat || '-'}</td>
                                    <td className="px-4 py-3">{p?.tahun || '-'}</td>
                                    <td className="px-4 py-3">{p?.deskripsi || '-'}</td>
                                    <td className="px-4 py-3">
                                        {p?.fileBukti ? (
                                            <a href={p.fileBukti} target="_blank" rel="noopener" className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                                                <i className="bi bi-link-45deg" /> Buka
                                            </a>
                                        ) : ('-')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {!p?.valid ? (
                                            <Badge status="ditolak" />
                                        ) : p?.duplicate ? (
                                            <Badge status="pending" />
                                        ) : (
                                            <Badge status="diterima" />
                                        )}
                                        <div className="mt-1 text-xs text-slate-500">
                                            {!p?.valid ? 'NIM Tidak Ada' : p?.duplicate ? 'Duplikat' : 'Valid'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr><td colSpan="9" className="px-4 py-6 text-center text-slate-400">Tidak ada baris preview.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {rows.length > 0 && (
                    <form onSubmit={confirm} className="mt-3 flex justify-end gap-2">
                        <Link href={route('admin.luaran.index')} className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold">
                            Kembali
                        </Link>
                        <button disabled={form.processing} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white">
                            Import Sekarang
                        </button>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
