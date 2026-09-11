import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import { route } from '../../../lib/route';

const input = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100';

export default function Edit({ m = null, mahasiswa = null }) {
    const mhs = m || mahasiswa || {};
    const kel = mhs.keluarga || {};

    const form = useForm({
        _method: 'PUT',
        nim: mhs.nim || '',
        nama: mhs.nama || '',
        jurusan: mhs.jurusan || '',
        angkatan: mhs.angkatan || '',
        jenisReguler: mhs.jenisReguler || 'Reguler A',
        disabilitas: mhs.disabilitas || '',
        levelHambatan: mhs.levelHambatan || '',
        jalurMasuk: mhs.jalurMasuk || '',
        nik: mhs.nik || '',
        jenisKelamin: mhs.jenisKelamin || 'Laki-laki',
        tempatLahir: mhs.tempatLahir || '',
        tanggalLahir: mhs.tanggalLahir || '',
        agama: mhs.agama || '',
        noHp: mhs.noHp || '',
        email: mhs.email || '',
        alamat: mhs.alamat || '',
        status: mhs.status || 'aktif',
        namaAyah: kel.namaAyah || '',
        namaIbu: kel.namaIbu || '',
        pekerjaanAyah: kel.pekerjaanAyah || '',
        pekerjaanIbu: kel.pekerjaanIbu || '',
        noHpAyah: kel.noHpAyah || '',
        noHpIbu: kel.noHpIbu || '',
        fileKtp: null,
        fileKk: null,
        fileSuratKerja: null,
        fotoProfil: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('mahasiswa.update', mhs.idMahasiswa), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Mahasiswa">
            <PageHeader
                title="Edit Mahasiswa"
                subtitle={`${mhs.nama || ''} (${mhs.nim || ''})`}
                actions={[{ label: 'Kembali', href: route('mahasiswa.index'), variant: 'secondary', icon: 'bi-arrow-left' }]}
            />
            <form onSubmit={submit} className="rounded-3xl border border-slate-200/80 bg-white p-5 md:p-7 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    1. Data Akademik & Identitas Utama
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">NIM *</label>
                        <input value={form.data.nim} onChange={(e) => form.setData('nim', e.target.value)} required className={input} />
                        {form.errors.nim && <div className="text-xs text-rose-500 mt-1">{form.errors.nim}</div>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Nama Lengkap *</label>
                        <input value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} required className={input} />
                        {form.errors.nama && <div className="text-xs text-rose-500 mt-1">{form.errors.nama}</div>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Program Studi</label>
                        <input value={form.data.jurusan} onChange={(e) => form.setData('jurusan', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Angkatan</label>
                        <input type="number" value={form.data.angkatan} onChange={(e) => form.setData('angkatan', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Jenis Perkuliahan (Reguler)</label>
                        <select value={form.data.jenisReguler} onChange={(e) => form.setData('jenisReguler', e.target.value)} className={input}>
                            <option value="Reguler A">Reguler A (Pagi)</option>
                            <option value="Reguler B">Reguler B (Malam)</option>
                            <option value="Reguler C (Karyawan)">Reguler C (Karyawan)</option>
                            <option value="Reguler CK">Reguler CK (Sabtu-Minggu)</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Jenis Disabilitas</label>
                        <input value={form.data.disabilitas} onChange={(e) => form.setData('disabilitas', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Level Hambatan</label>
                        <input value={form.data.levelHambatan} onChange={(e) => form.setData('levelHambatan', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Status Mahasiswa</label>
                        <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className={input}>
                            <option value="aktif">Aktif</option>
                            <option value="cuti">Cuti</option>
                            <option value="nonaktif">Nonaktif</option>
                            <option value="lulus">Lulus (Otomatis Menjadi Alumni)</option>
                        </select>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mt-7 mb-4 border-b border-slate-100 pb-2">
                    2. Data Pribadi & Kontak
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">NIK KTP</label>
                        <input value={form.data.nik} onChange={(e) => form.setData('nik', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Jenis Kelamin</label>
                        <select value={form.data.jenisKelamin} onChange={(e) => form.setData('jenisKelamin', e.target.value)} className={input}>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Agama</label>
                        <input value={form.data.agama} onChange={(e) => form.setData('agama', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Tempat Lahir</label>
                        <input value={form.data.tempatLahir} onChange={(e) => form.setData('tempatLahir', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Tanggal Lahir</label>
                        <input type="date" value={form.data.tanggalLahir} onChange={(e) => form.setData('tanggalLahir', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">No. HP / WhatsApp</label>
                        <input value={form.data.noHp} onChange={(e) => form.setData('noHp', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Email</label>
                        <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className={input} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                        <input value={form.data.alamat} onChange={(e) => form.setData('alamat', e.target.value)} className={input} />
                    </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mt-7 mb-4 border-b border-slate-100 pb-2">
                    3. Berkas Identitas (Unggah baru untuk mengganti berkas lama)
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Scan KTP</label>
                        {mhs.fileKtp && (
                            <a href={`/storage/${mhs.fileKtp}`} target="_blank" rel="noreferrer" className="text-xs text-[#2563eb] block mb-1 hover:underline">
                                <i className="bi bi-file-earmark-check mr-1" />Lihat KTP Terunggah
                            </a>
                        )}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => form.setData('fileKtp', e.target.files[0])} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Scan Kartu Keluarga (KK)</label>
                        {mhs.fileKk && (
                            <a href={`/storage/${mhs.fileKk}`} target="_blank" rel="noreferrer" className="text-xs text-[#2563eb] block mb-1 hover:underline">
                                <i className="bi bi-file-earmark-check mr-1" />Lihat KK Terunggah
                            </a>
                        )}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => form.setData('fileKk', e.target.files[0])} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Surat Kerja / ID Card (Reguler Karyawan)</label>
                        {mhs.fileSuratKerja && (
                            <a href={`/storage/${mhs.fileSuratKerja}`} target="_blank" rel="noreferrer" className="text-xs text-[#2563eb] block mb-1 hover:underline">
                                <i className="bi bi-file-earmark-check mr-1" />Lihat Surat Kerja Terunggah
                            </a>
                        )}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => form.setData('fileSuratKerja', e.target.files[0])} className={input} />
                    </div>
                </div>

                <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                        <i className="bi bi-check-circle-fill text-sm" />
                        <span>{form.processing ? 'Menyimpan...' : 'Update Data Mahasiswa'}</span>
                    </button>
                    <Link
                        href={route('mahasiswa.index')}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}