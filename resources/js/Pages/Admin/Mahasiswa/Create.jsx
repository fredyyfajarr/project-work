import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import { route } from '../../../lib/route';

const input = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100';

export default function Create() {
    const form = useForm({
        nim: '',
        nama: '',
        jurusan: '',
        angkatan: '',
        jenisReguler: 'Reguler A',
        disabilitas: '',
        levelHambatan: '',
        jalurMasuk: '',
        nik: '',
        jenisKelamin: 'Laki-laki',
        tempatLahir: '',
        tanggalLahir: '',
        agama: '',
        noHp: '',
        email: '',
        alamat: '',
        status: 'aktif',
        namaAyah: '',
        namaIbu: '',
        pekerjaanAyah: '',
        pekerjaanIbu: '',
        noHpAyah: '',
        noHpIbu: '',
        fileKtp: null,
        fileKk: null,
        fileSuratKerja: null,
        fotoProfil: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('mahasiswa.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Tambah Mahasiswa">
            <PageHeader
                title="Tambah Mahasiswa"
                subtitle="Tambahkan data profil mahasiswa disabilitas baru dan buat akun sistem otomatis."
                actions={[{ label: 'Kembali', href: route('mahasiswa.index'), variant: 'secondary', icon: 'bi-arrow-left' }]}
            />
            <form onSubmit={submit} className="rounded-3xl border border-slate-200/80 bg-white p-5 md:p-7 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    1. Data Akademik & Identitas Utama
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">NIM *</label>
                        <input value={form.data.nim} onChange={(e) => form.setData('nim', e.target.value)} required className={input} placeholder="Nomor Induk Mahasiswa" />
                        {form.errors.nim && <div className="text-xs text-rose-500 mt-1">{form.errors.nim}</div>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Nama Lengkap *</label>
                        <input value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} required className={input} placeholder="Nama lengkap sesuai KTP" />
                        {form.errors.nama && <div className="text-xs text-rose-500 mt-1">{form.errors.nama}</div>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Program Studi</label>
                        <input value={form.data.jurusan} onChange={(e) => form.setData('jurusan', e.target.value)} className={input} placeholder="Contoh: Teknik Informatika" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Angkatan</label>
                        <input type="number" value={form.data.angkatan} onChange={(e) => form.setData('angkatan', e.target.value)} className={input} placeholder="Tahun angkatan, contoh: 2024" />
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
                        <input value={form.data.disabilitas} onChange={(e) => form.setData('disabilitas', e.target.value)} className={input} placeholder="Netra / Rungu / Daksa / dll." />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Level Hambatan</label>
                        <input value={form.data.levelHambatan} onChange={(e) => form.setData('levelHambatan', e.target.value)} className={input} placeholder="Ringan / Sedang / Berat" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Status Mahasiswa</label>
                        <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className={input}>
                            <option value="aktif">Aktif</option>
                            <option value="cuti">Cuti</option>
                            <option value="nonaktif">Nonaktif</option>
                            <option value="lulus">Lulus (Alumni)</option>
                        </select>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mt-7 mb-4 border-b border-slate-100 pb-2">
                    2. Data Pribadi & Kontak
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">NIK KTP</label>
                        <input value={form.data.nik} onChange={(e) => form.setData('nik', e.target.value)} className={input} placeholder="16 digit NIK" />
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
                        <input value={form.data.agama} onChange={(e) => form.setData('agama', e.target.value)} className={input} placeholder="Agama" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Tempat Lahir</label>
                        <input value={form.data.tempatLahir} onChange={(e) => form.setData('tempatLahir', e.target.value)} className={input} placeholder="Kota lahir" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Tanggal Lahir</label>
                        <input type="date" value={form.data.tanggalLahir} onChange={(e) => form.setData('tanggalLahir', e.target.value)} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">No. HP / WhatsApp</label>
                        <input value={form.data.noHp} onChange={(e) => form.setData('noHp', e.target.value)} className={input} placeholder="08xxxxxxxxxx" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Email</label>
                        <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className={input} placeholder="email@domain.com" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                        <input value={form.data.alamat} onChange={(e) => form.setData('alamat', e.target.value)} className={input} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota" />
                    </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mt-7 mb-4 border-b border-slate-100 pb-2">
                    3. Berkas Identitas & Dokumen Pendukung (PDF/JPG/PNG)
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Scan KTP</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => form.setData('fileKtp', e.target.files[0])} className={input} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Scan Kartu Keluarga (KK)</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => form.setData('fileKk', e.target.files[0])} className={input} />
                    </div>
                    <div className={form.data.jenisReguler === 'Reguler C (Karyawan)' ? 'rounded-xl bg-amber-50 p-2 border border-amber-200' : ''}>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                            Surat Keterangan Kerja / ID Card Perusahaan {form.data.jenisReguler === 'Reguler C (Karyawan)' && <span className="text-amber-700 font-bold">(Wajib Karyawan)</span>}
                        </label>
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
                        <span>{form.processing ? 'Menyimpan...' : 'Simpan Data Mahasiswa'}</span>
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