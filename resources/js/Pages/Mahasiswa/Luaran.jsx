import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';
import DataTable from '../../Components/DataTable';

export default function Luaran({ mahasiswa = {}, luaran = [] }) {
    const m = mahasiswa || {};
    const rows = Array.isArray(luaran) ? luaran : [];
    const form = useForm({ judul: '', jenisLuaran: 'Prestasi', tingkat: '', tahun: new Date().getFullYear(), deskripsi: '', fileBukti: null });
    const submit = (e) => { e.preventDefault(); form.post('/mahasiswa/luaran', { forceFormData: true }); };
    const input = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]';
    return (
        <AdminLayout title="Luaran Mahasiswa">
            <div className="grid gap-4 md:grid-cols-2">
                <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold">Tambah Luaran</h3>
                    <p className="text-sm text-slate-500">Luaran berstatus pending dan bisa divalidasi admin.</p>
                    <div className="mt-2 grid gap-2">
                        <div><label className="text-sm font-semibold">Judul</label><input value={form.data.judul} onChange={(e) => form.setData('judul', e.target.value)} required className={input} /></div>
                        <div><label className="text-sm font-semibold">Jenis Luaran</label>
                            <select value={form.data.jenisLuaran} onChange={(e) => form.setData('jenisLuaran', e.target.value)} className={input}>
                                {['Prestasi', 'Sertifikat Pelatihan', 'Media Massa', 'Jurnal / Publikasi', 'HAKI', 'Karya Kreatif', 'Organisasi / Kepanitiaan', 'Lainnya'].map((j) => <option key={j} value={j}>{j}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div><label className="text-sm font-semibold">Tingkat</label><input value={form.data.tingkat} onChange={(e) => form.setData('tingkat', e.target.value)} placeholder="Nasional/Universitas" className={input} /></div>
                            <div><label className="text-sm font-semibold">Tahun</label><input type="number" value={form.data.tahun} onChange={(e) => form.setData('tahun', e.target.value)} className={input} /></div>
                        </div>
                        <div><label className="text-sm font-semibold">Upload File Bukti</label><input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => form.setData('fileBukti', e.target.files[0])} className={input} /><small className="text-slate-500">PDF/JPG/PNG, maksimal 5 MB.</small></div>
                        <div><label className="text-sm font-semibold">Deskripsi</label><textarea value={form.data.deskripsi} onChange={(e) => form.setData('deskripsi', e.target.value)} rows="3" className={input} /></div>
                        <button className="w-full sm:w-auto rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-5 py-2.5 text-xs font-bold text-white transition shadow-xs cursor-pointer">Kirim Luaran</button>
                    </div>
                </form>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold mb-2">Riwayat Luaran</h3>
                    <DataTable
                        perPage={5}
                        data={rows}
                        searchable={false}
                        columns={[
                            {
                                label: 'Judul & Keterangan',
                                render: (it) => (
                                    <div>
                                        <div className="font-semibold text-slate-800">{it?.judul}</div>
                                        <div className="text-xs text-slate-500">{it?.jenisLuaran} • {it?.tingkat || '-'} • {it?.tahun || '-'}</div>
                                    </div>
                                ),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                className: 'text-right',
                                render: (it) => <Badge status={it?.status || 'pending'} />,
                            },
                        ]}
                        emptyTitle="Belum ada data luaran"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
