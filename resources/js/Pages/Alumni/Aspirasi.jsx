import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';
import DataTable from '../../Components/DataTable';

export default function Aspirasi({ mahasiswa = {}, aspirasi = [] }) {
    const rows = Array.isArray(aspirasi) ? aspirasi : [];
    const form = useForm({
        kategori: 'Pengembangan Layanan',
        pesan: '',
        file_lampiran: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/alumni/aspirasi', {
            forceFormData: true,
            onSuccess: () => form.reset('pesan', 'file_lampiran'),
        });
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100';

    return (
        <AdminLayout title="Aspirasi & Masukan Alumni">
            <div className="grid gap-6 lg:grid-cols-2">
                <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800">Sampaikan Aspirasi / Masukan</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Masukan Anda sangat berharga untuk peningkatan fasilitas dan dukungan inklusif di LLD Universitas Pamulang.
                    </p>

                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Kategori Masukan</label>
                            <select
                                value={form.data.kategori}
                                onChange={(e) => form.setData('kategori', e.target.value)}
                                className={`mt-1.5 ${inputClass}`}
                            >
                                <option value="Pengembangan Layanan">Pengembangan Layanan Inklusif</option>
                                <option value="Peluang Karier & Magang">Peluang Karier & Rekomendasi Magang</option>
                                <option value="Fasilitas & Aksesibilitas">Fasilitas & Aksesibilitas Kampus</option>
                                <option value="Kegiatan Alumni">Kegiatan & Reuni Alumni Disabilitas</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Isi Pesan / Masukan *</label>
                            <textarea
                                value={form.data.pesan}
                                onChange={(e) => form.setData('pesan', e.target.value)}
                                rows="5"
                                placeholder="Tuliskan detail masukan atau kendala yang ingin Anda sampaikan..."
                                required
                                className={`mt-1.5 ${inputClass}`}
                            />
                            {form.errors.pesan && <p className="mt-1 text-xs text-rose-500">{form.errors.pesan}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Lampiran Dokumen / Foto Pendukung (Opsional)</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => form.setData('file_lampiran', e.target.files[0])}
                                className={`mt-1.5 ${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#2563eb]`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                            <i className="bi bi-send-fill text-xs" />
                            <span>{form.processing ? 'Mengirim...' : 'Kirim Aspirasi'}</span>
                        </button>
                    </div>
                </form>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 mb-4">Riwayat Aspirasi Alumni</h3>
                    <DataTable
                        data={rows}
                        searchable={false}
                        columns={[
                            {
                                label: 'Aspirasi',
                                render: (it) => (
                                    <div>
                                        <div className="text-xs font-bold text-slate-800">{it.kategori}</div>
                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{it.pesan}</p>
                                        {it?.tanggapan && (
                                            <div className="mt-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-200">
                                                <div className="font-bold flex items-center gap-1 mb-1">
                                                    <i className="bi bi-chat-left-dots-fill text-blue-600 dark:text-blue-400"></i>
                                                    Tanggapan Layanan Layanan Disabilitas:
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{it.tanggapan}</p>
                                            </div>
                                        )}
                                        <div className="mt-1 text-[11px] text-slate-400">
                                            {it.created_at ? new Date(it.created_at).toLocaleDateString('id-ID') : '-'}
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Status',
                                className: 'text-right align-top',
                                render: (it) => <Badge status={it.status || 'Diajukan'} />,
                            },
                        ]}
                        emptyTitle="Belum ada aspirasi"
                        emptyDescription="Aspirasi yang Anda kirimkan akan dicatat dan ditindaklanjuti oleh staf LLD."
                    />
                </div>
            </div>
        </AdminLayout>
    );
}