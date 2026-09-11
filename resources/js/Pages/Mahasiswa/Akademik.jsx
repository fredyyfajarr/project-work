import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/DataTable';
import Badge from '../../Components/Badge';
import { confirmAction } from '../../lib/confirm';

export default function Akademik({ mahasiswa = {}, akademik = [] }) {
    const m = mahasiswa || {};
    const rows = Array.isArray(akademik) ? akademik : [];
    const form = useForm({ semester: '', ips: '', ipk: '' });
    const submit = (e) => { e.preventDefault(); form.post('/mahasiswa/akademik'); form.reset('semester', 'ips', 'ipk'); };

    const hapus = (id) => {
        confirmAction({
            title: 'Hapus Data Akademik',
            message: 'Apakah Anda yakin ingin menghapus data akademik semester ini?',
            confirmText: 'Ya, Hapus',
            type: 'danger',
            onConfirm: () => router.delete(`/mahasiswa/akademik/${id}`),
        });
    };
    return (
        <AdminLayout title="Data Akademik">
            <div className="grid gap-4 md:grid-cols-2">
                <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold">Tambah Data Akademik</h3>
                    <p className="text-sm text-slate-500">Data otomatis tersambung ke menu akademik dan monitoring admin.</p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div><label className="text-xs font-semibold text-slate-700">Semester</label><input type="number" min="1" max="14" value={form.data.semester} onChange={(e) => form.setData('semester', e.target.value)} required placeholder="Contoh: 1" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-blue-100" /></div>
                        <div><label className="text-xs font-semibold text-slate-700">IPS</label><input type="number" step="0.01" min="0" max="4" value={form.data.ips} onChange={(e) => form.setData('ips', e.target.value)} required placeholder="0.00 - 4.00" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-blue-100" /></div>
                        <div><label className="text-xs font-semibold text-slate-700">IPK</label><input type="number" step="0.01" min="0" max="4" value={form.data.ipk} onChange={(e) => form.setData('ipk', e.target.value)} required placeholder="0.00 - 4.00" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-blue-100" /></div>
                    </div>
                    <button className="mt-4 w-full sm:w-auto rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-5 py-2.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"><i className="bi bi-plus-circle mr-1.5" />Simpan Akademik</button>
                </form>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold">Riwayat Akademik Saya</h3>
                    <div className="mt-2">
                        <DataTable data={rows} perPage={10} searchable={false} columns={[
                            { key: 'semester', label: 'Semester', render: (r) => `Semester ${r?.semester ?? '-'}` },
                            { key: 'ips', label: 'IPS' }, { key: 'ipk', label: 'IPK' },
                            { label: 'Status', render: (r) => <Badge status={Number(r?.ipk ?? 4) < 2.75 ? 'Perlu Monitoring' : 'Aman'} /> },
                            {
                                label: 'Aksi',
                                render: (r) => (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => hapus(r?.idAkademik || r?.id)}
                                            title="Hapus Data Semester Ini"
                                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                                        >
                                            <i className="bi bi-trash text-base leading-none" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]} emptyTitle="Belum ada data akademik" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
