import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Profil({ user = {}, mahasiswa = {} }) {
    const u = user || {};
    const m = mahasiswa || {};

    const form = useForm({
        email: m?.email || '',
        noHp: m?.noHp || '',
        alamat: m?.alamat || '',
        password: '',
        password_confirmation: '',
        fotoProfil: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/alumni/profil', {
            forceFormData: true,
            onSuccess: () => form.reset('password', 'password_confirmation'),
        });
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100';

    return (
        <AdminLayout title="Profil Alumni">
            <div className="mx-auto max-w-3xl">
                <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm">
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-800">Pengaturan Profil & Akun Alumni</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Perbarui informasi kontak dan kata sandi akun alumni Anda.
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
                            <div>
                                <span className="text-slate-400 block">Nama Lengkap</span>
                                <span className="font-bold text-slate-800 text-sm">{m?.nama || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">NIM / Username</span>
                                <span className="font-bold text-slate-800 text-sm">{m?.nim || u?.username || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Program Studi</span>
                                <span className="font-semibold text-slate-700">{m?.jurusan || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Jenis Disabilitas</span>
                                <span className="font-semibold text-blue-600">{m?.disabilitas || '-'}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Email Aktif</label>
                            <input
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                className={`mt-1.5 ${inputClass}`}
                            />
                            {form.errors.email && <p className="mt-1 text-xs text-rose-500">{form.errors.email}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
                            <input
                                type="text"
                                value={form.data.noHp}
                                onChange={(e) => form.setData('noHp', e.target.value)}
                                className={`mt-1.5 ${inputClass}`}
                            />
                            {form.errors.noHp && <p className="mt-1 text-xs text-rose-500">{form.errors.noHp}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Alamat Domisili</label>
                            <textarea
                                rows="3"
                                value={form.data.alamat}
                                onChange={(e) => form.setData('alamat', e.target.value)}
                                className={`mt-1.5 ${inputClass}`}
                            />
                        </div>

                        <div className="border-t border-slate-100 pt-4 mt-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Ubah Password (Kosongkan bila tidak diubah)</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Password Baru</label>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        className={`mt-1.5 ${inputClass}`}
                                    />
                                    {form.errors.password && <p className="mt-1 text-xs text-rose-500">{form.errors.password}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password baru"
                                        className={`mt-1.5 ${inputClass}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                            >
                                <i className="bi bi-save" />
                                <span>{form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}