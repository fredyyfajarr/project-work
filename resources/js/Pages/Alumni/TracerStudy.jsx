import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function TracerStudy({ mahasiswa = {}, tracer = null }) {
    const m = mahasiswa || {};
    const t = tracer || null;

    const form = useForm({
        statusPekerjaan: t?.statusPekerjaan || 'Bekerja',
        namaInstansi: t?.namaInstansi || '',
        jabatan: t?.jabatan || '',
        bidangPekerjaan: t?.bidangPekerjaan || '',
        jenisPekerjaan: t?.jenisPekerjaan || 'Penuh Waktu (Full Time)',
        lokasiPekerjaan: t?.lokasiPekerjaan || '',
        tahunMulai: t?.tahunMulai || new Date().getFullYear(),
        masaTungguBulan: t?.masaTungguBulan || 0,
        kesesuaianBidang: t?.kesesuaianBidang || 'Sesuai',
        pendapatanBulanan: t?.pendapatanBulanan || '',
        namaUniversitasLanjut: t?.namaUniversitasLanjut || '',
        prodiLanjut: t?.prodiLanjut || '',
        saranLayanan: t?.saranLayanan || '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/alumni/tracer-study');
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100';

    return (
        <AdminLayout title="Kuesioner Tracer Study Alumni">
            <div className="mx-auto max-w-4xl">
                <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm">
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-800">Tracer Study Alumni Disabilitas</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Data ini digunakan oleh LLD Universitas Pamulang untuk evaluasi mutu layanan dan pelaporan lulusan disabilitas.
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        {/* Status Pekerjaan */}
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Status Pekerjaan Saat Ini *</label>
                            <select
                                value={form.data.statusPekerjaan}
                                onChange={(e) => form.setData('statusPekerjaan', e.target.value)}
                                required
                                className={`mt-1.5 ${inputClass}`}
                            >
                                <option value="Bekerja">Bekerja (Karyawan / Pegawai)</option>
                                <option value="Wirausaha">Wirausaha / Membuka Usaha Sendiri</option>
                                <option value="Melanjutkan Studi">Melanjutkan Studi (S2 / Kursus Profesi)</option>
                                <option value="Belum Bekerja">Belum Bekerja / Sedang Mencari Kerja</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        {/* Jika Bekerja atau Wirausaha */}
                        {(form.data.statusPekerjaan === 'Bekerja' || form.data.statusPekerjaan === 'Wirausaha') && (
                            <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50/70 p-5 border border-slate-100">
                                <div className="sm:col-span-2 text-xs font-bold text-blue-900 border-b border-slate-200/60 pb-2">
                                    Informasi Tempat Kerja & Profesi
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Nama Instansi / Perusahaan / Nama Usaha</label>
                                    <input
                                        type="text"
                                        value={form.data.namaInstansi}
                                        onChange={(e) => form.setData('namaInstansi', e.target.value)}
                                        placeholder="Contoh: PT Teknologi Inklusif Indonesia"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Jabatan / Posisi</label>
                                    <input
                                        type="text"
                                        value={form.data.jabatan}
                                        onChange={(e) => form.setData('jabatan', e.target.value)}
                                        placeholder="Contoh: Web Developer / Staf Administrasi"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Bidang Pekerjaan</label>
                                    <input
                                        type="text"
                                        value={form.data.bidangPekerjaan}
                                        onChange={(e) => form.setData('bidangPekerjaan', e.target.value)}
                                        placeholder="Contoh: Teknologi Informasi / Pendidikan / Jasa"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Jenis Pekerjaan</label>
                                    <select
                                        value={form.data.jenisPekerjaan}
                                        onChange={(e) => form.setData('jenisPekerjaan', e.target.value)}
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    >
                                        <option value="Penuh Waktu (Full Time)">Penuh Waktu (Full Time)</option>
                                        <option value="Paruh Waktu (Part Time)">Paruh Waktu (Part Time)</option>
                                        <option value="Freelance / Lepas">Freelance / Lepas</option>
                                        <option value="Kontrak">Kontrak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Lokasi Tempat Kerja (Kota/Wilayah)</label>
                                    <input
                                        type="text"
                                        value={form.data.lokasiPekerjaan}
                                        onChange={(e) => form.setData('lokasiPekerjaan', e.target.value)}
                                        placeholder="Contoh: Jakarta Selatan / Tangerang Selatan"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Masa Tunggu Mendapat Kerja Pertama (Bulan)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.data.masaTungguBulan}
                                        onChange={(e) => form.setData('masaTungguBulan', e.target.value)}
                                        placeholder="0 jika langsung bekerja"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-slate-700">Kesesuaian Bidang Studi dengan Pekerjaan</label>
                                    <select
                                        value={form.data.kesesuaianBidang}
                                        onChange={(e) => form.setData('kesesuaianBidang', e.target.value)}
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    >
                                        <option value="Sangat Sesuai">Sangat Sesuai</option>
                                        <option value="Sesuai">Sesuai</option>
                                        <option value="Kurang Sesuai">Kurang Sesuai</option>
                                        <option value="Tidak Sesuai">Tidak Sesuai</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Jika Melanjutkan Studi */}
                        {form.data.statusPekerjaan === 'Melanjutkan Studi' && (
                            <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-indigo-50/60 p-5 border border-indigo-100">
                                <div className="sm:col-span-2 text-xs font-bold text-indigo-900 border-b border-indigo-200/60 pb-2">
                                    Informasi Studi Lanjutan
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Nama Universitas / Lembaga Pendidikan</label>
                                    <input
                                        type="text"
                                        value={form.data.namaUniversitasLanjut}
                                        onChange={(e) => form.setData('namaUniversitasLanjut', e.target.value)}
                                        placeholder="Contoh: Universitas Pamulang"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Program Studi / Jenjang</label>
                                    <input
                                        type="text"
                                        value={form.data.prodiLanjut}
                                        onChange={(e) => form.setData('prodiLanjut', e.target.value)}
                                        placeholder="Contoh: Magister Teknik Informatika (S2)"
                                        className={`mt-1.5 ${inputClass} bg-white`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Saran dan Masukan untuk LLD */}
                        <div>
                            <label className="text-xs font-semibold text-slate-700">
                                Saran & Masukan untuk Peningkatan Layanan LLD UNPAM
                            </label>
                            <textarea
                                rows="4"
                                value={form.data.saranLayanan}
                                onChange={(e) => form.setData('saranLayanan', e.target.value)}
                                placeholder="Tuliskan pengalaman atau masukan yang dapat membantu adik-adik mahasiswa disabilitas lainnya..."
                                className={`mt-1.5 ${inputClass}`}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                            >
                                <i className="bi bi-check-circle-fill text-sm" />
                                <span>{form.processing ? 'Menyimpan...' : 'Simpan Kuesioner Tracer Study'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}