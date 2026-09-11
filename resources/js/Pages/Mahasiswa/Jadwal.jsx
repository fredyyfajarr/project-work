import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/DataTable';
import { confirmAction } from '../../lib/confirm';

export default function Jadwal({ mahasiswa = {}, jadwal = [] }) {
    const m = mahasiswa || {};
    const rows = Array.isArray(jadwal) ? jadwal : [];
    const form = useForm({ semester: '', judul_jadwal: '', file_jadwal: null, keterangan: '' });
    const submit = (e) => { e.preventDefault(); form.post('/mahasiswa/jadwal', { forceFormData: true }); };

    const hapus = (id) => {
        confirmAction({
            title: 'Hapus File Jadwal',
            message: 'Apakah Anda yakin ingin menghapus file jadwal semester ini?',
            confirmText: 'Ya, Hapus',
            type: 'danger',
            onConfirm: () => router.delete(`/mahasiswa/jadwal/${id}`),
        });
    };
    const input = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]';
    return (
        <AdminLayout title="Kelola Jadwal">
            <div className="grid gap-4 md:grid-cols-2">
                <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold">Upload Jadwal Per Semester</h3>
                    <p className="text-sm text-slate-500">File terhubung ke menu Monitoring Jadwal admin.</p>
                    <div className="mt-2 grid gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div><label className="text-sm font-semibold">Semester *</label><input type="number" min="1" max="14" value={form.data.semester} onChange={(e) => form.setData('semester', e.target.value)} required className={input} /></div>
                            <div><label className="text-sm font-semibold">Judul Jadwal</label><input value={form.data.judul_jadwal} onChange={(e) => form.setData('judul_jadwal', e.target.value)} className={input} /></div>
                        </div>
                        <div><label className="text-sm font-semibold">File Jadwal *</label><input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => form.setData('file_jadwal', e.target.files[0])} required className={input} /></div>
                        <div><label className="text-sm font-semibold">Keterangan</label><textarea value={form.data.keterangan} onChange={(e) => form.setData('keterangan', e.target.value)} rows="3" className={input} /></div>
                        <button className="w-full sm:w-auto rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-5 py-2.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"><i className="bi bi-upload mr-1.5" />Upload Jadwal</button>
                    </div>
                </form>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-bold mb-2">Jadwal Saya</h3>
                    <DataTable
                        perPage={5}
                        data={rows}
                        searchable={false}
                        columns={[
                            {
                                label: 'Semester & Judul',
                                render: (it) => (
                                    <div>
                                        <div className="font-semibold text-slate-800">{it?.judul_jadwal || `Jadwal Semester ${it?.semester}`}</div>
                                        <div className="text-xs text-slate-500">Semester {it?.semester || '-'} • {it?.keterangan || '-'}</div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Aksi',
                                className: 'text-right',
                                render: (it) => (
                                    <div className="flex items-center justify-end gap-1">
                                        {it?.file_jadwal && (
                                            <a
                                                href={`/file/jadwal/${it?.idJadwal || it?.id || ''}`}
                                                target="_blank"
                                                rel="noopener"
                                                title="Unduh File Jadwal"
                                                className="rounded-lg p-1.5 text-[#2563eb] hover:bg-blue-50 hover:text-blue-700 transition"
                                            >
                                                <i className="bi bi-file-earmark-arrow-down text-base leading-none" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => hapus(it?.idJadwal || it?.id)}
                                            title="Hapus Jadwal"
                                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                                        >
                                            <i className="bi bi-trash text-base leading-none" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        emptyTitle="Belum ada file jadwal yang diunggah"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
