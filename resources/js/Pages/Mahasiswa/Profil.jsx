import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';

export default function Profil({ mahasiswa = {} }) {
    const m = mahasiswa || {};
    const contactForm = useForm({
        email: m.email || '',
        noHp: m.noHp || '',
        alamat: m.alamat || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const submitContact = (e) => {
        e.preventDefault();
        contactForm.post('/mahasiswa/profil', {
            preserveScroll: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post('/mahasiswa/ganti-password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/15';

    return (
        <AdminLayout title="Profil & Keamanan Akun">
            <div className="space-y-6">
                {/* Header Profil Mahasiswa */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2196f3] to-[#1565c0] text-4xl text-white shadow-md shadow-blue-500/20">
                            <i className="bi bi-person-fill" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{m.nama || '-'}</h2>
                                <Badge status={m.status || 'aktif'} />
                            </div>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                NIM: <span className="font-bold text-slate-700">{m.nim || '-'}</span> • {m.jurusan || '-'} • Angkatan {m.angkatan || '-'}
                            </p>
                            <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-2">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#1976d2] border border-sky-200">
                                    <i className="bi bi-person-wheelchair" />
                                    {m.disabilitas || m.jenisHambatan || 'Disabilitas'}
                                </span>
                                {m.levelHambatan && (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                                        Tingkat: {m.levelHambatan}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Data Mahasiswa & Kontak */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Data Akademik Mahasiswa */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-xs">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
                            <i className="bi bi-person-vcard text-[#2196f3] text-lg" />
                            <h3 className="font-bold text-slate-800">Informasi Akademik</h3>
                        </div>
                        <div className="mt-4 divide-y divide-slate-100 text-sm">
                            {[
                                ['NIM', m.nim],
                                ['Nama Lengkap', m.nama],
                                ['Program Studi', m.jurusan],
                                ['Angkatan', m.angkatan],
                                ['Jenis Disabilitas', m.disabilitas || m.jenisHambatan],
                                ['Level Hambatan', m.levelHambatan],
                                ['Status Mahasiswa', m.status],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between py-2.5">
                                    <span className="text-slate-500">{label}</span>
                                    <span className="font-semibold text-slate-800 text-right">{val || '-'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Update Kontak Mahasiswa */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-xs">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
                            <i className="bi bi-telephone text-[#2196f3] text-lg" />
                            <h3 className="font-bold text-slate-800">Perbarui Kontak & Alamat</h3>
                        </div>
                        <form onSubmit={submitContact} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Email Akun (Digunakan untuk login & reset password)</label>
                                <input
                                    type="email"
                                    value={contactForm.data.email}
                                    onChange={(e) => contactForm.setData('email', e.target.value)}
                                    placeholder="email.anda@unpam.ac.id"
                                    className={`mt-1.5 ${inputClass}`}
                                />
                                {contactForm.errors.email && <p className="mt-1 text-xs text-rose-500">{contactForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
                                <input
                                    type="text"
                                    value={contactForm.data.noHp}
                                    onChange={(e) => contactForm.setData('noHp', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className={`mt-1.5 ${inputClass}`}
                                />
                                {contactForm.errors.noHp && <p className="mt-1 text-xs text-rose-500">{contactForm.errors.noHp}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                                <textarea
                                    value={contactForm.data.alamat}
                                    onChange={(e) => contactForm.setData('alamat', e.target.value)}
                                    rows="3"
                                    placeholder="Alamat domisili saat ini"
                                    className={`mt-1.5 ${inputClass}`}
                                />
                                {contactForm.errors.alamat && <p className="mt-1 text-xs text-rose-500">{contactForm.errors.alamat}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={contactForm.processing}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#2196f3] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1976d2] transition disabled:opacity-50 cursor-pointer"
                            >
                                <i className="bi bi-save" />
                                <span>{contactForm.processing ? 'Menyimpan...' : 'Simpan Kontak'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Card Ganti Kata Sandi */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
                        <i className="bi bi-shield-lock text-[#2196f3] text-lg" />
                        <div>
                            <h3 className="font-bold text-slate-800">Ganti Kata Sandi (Password)</h3>
                            <p className="text-xs text-slate-500">Amankan akun Anda dengan mengganti kata sandi default sistem secara berkala.</p>
                        </div>
                    </div>

                    <div className="mt-4 mb-4 rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-900">
                        <div className="flex items-start gap-2">
                            <i className="bi bi-lightbulb-fill text-amber-600 text-sm shrink-0 mt-0.5" />
                            <div>
                                <strong>Catatan Kata Sandi Bawaan:</strong>
                                <p className="mt-0.5 text-amber-800">
                                    Jika Anda belum pernah mengubah password, kata sandi awal Anda adalah format bawaan sistem: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">lld#6digitakhirNIM</code> (misal: NIM 2026010012 → <code>lld#010012</code>).
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submitPassword} className="space-y-4 max-w-xl">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</label>
                            <div className="relative mt-1.5">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    placeholder="Masukkan kata sandi lama / default"
                                    required
                                    className={`${inputClass} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`} />
                                </button>
                            </div>
                            {passwordForm.errors.current_password && (
                                <p className="mt-1 text-xs text-rose-500 font-medium">{passwordForm.errors.current_password}</p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Kata Sandi Baru</label>
                                <div className="relative mt-1.5">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        required
                                        className={`${inputClass} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`} />
                                    </button>
                                </div>
                                {passwordForm.errors.password && (
                                    <p className="mt-1 text-xs text-rose-500 font-medium">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                                <div className="relative mt-1.5">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi kata sandi baru"
                                        required
                                        className={`${inputClass} pr-10`}
                                    />
                                </div>
                                {passwordForm.errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-rose-500 font-medium">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-900 transition disabled:opacity-50 cursor-pointer"
                        >
                            <i className="bi bi-key-fill" />
                            <span>{passwordForm.processing ? 'Memproses...' : 'Ubah Kata Sandi'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
