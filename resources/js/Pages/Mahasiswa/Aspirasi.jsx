import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';
import DataTable from '../../Components/DataTable';

export default function Aspirasi({ mahasiswa = {}, aspirasi = [] }) {
    const m = mahasiswa || {};
    const rows = Array.isArray(aspirasi) ? aspirasi : [];
    const form = useForm({ subjek: '', kategori: 'Akademik', pesan: '' });
    const submit = (e) => { e.preventDefault(); form.post('/mahasiswa/aspirasi'); form.reset('subjek', 'pesan'); };
    const input = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]';
    return (
        <AdminLayout title="Aspirasi Mahasiswa">
            <div className="grid gap-4 md:grid-cols-2">
                <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold">Kirim Aspirasi</h3>
                    <p className="text-sm text-slate-500">Sampaikan keluhan, masukan, atau kebutuhan layanan akademik.</p>
                    <div className="mt-2 grid gap-2">
                        <div><label className="text-sm font-semibold">Subjek</label><input value={form.data.subjek} onChange={(e) => form.setData('subjek', e.target.value)} required className={input} /></div>
                        <div><label className="text-sm font-semibold">Kategori</label>
                            <select value={form.data.kategori} onChange={(e) => form.setData('kategori', e.target.value)} className={input}>
                                {['Akademik', 'Fasilitas', 'Layanan Disabilitas', 'Lainnya'].map((k) => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div><label className="text-sm font-semibold">Pesan</label><textarea value={form.data.pesan} onChange={(e) => form.setData('pesan', e.target.value)} rows="5" required className={input} /></div>
                        <button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">Kirim Aspirasi</button>
                    </div>
                </form>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold mb-2">Riwayat Aspirasi</h3>
                    <DataTable
                        perPage={5}
                        data={rows}
                        searchable={false}
                        columns={[
                            {
                                label: 'Aspirasi',
                                render: (it) => (
                                    <div>
                                        <div className="font-semibold text-slate-800">{it?.subjek}</div>
                                        <div className="text-xs text-slate-500">{it?.kategori} • {it?.created_at ? new Date(it.created_at).toLocaleDateString('id-ID') : '-'}</div>
                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{it?.pesan}</p>
                                        {it?.tanggapan && (
                                            <div className="mt-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-200">
                                                <div className="font-bold flex items-center gap-1 mb-1">
                                                    <i className="bi bi-chat-left-dots-fill text-blue-600 dark:text-blue-400"></i>
                                                    Tanggapan Layanan Layanan Disabilitas:
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{it.tanggapan}</p>
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                className: 'text-right align-top',
                                render: (it) => <Badge status={it?.status || 'Diajukan'} />,
                            },
                        ]}
                        emptyTitle="Belum ada aspirasi"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
