import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import { route } from '../../../lib/route';

export default function Create({ mahasiswa = [] }) {
    const form = useForm({ role: '', username: '', email: '', idMahasiswa: '' });
    const [isMhs, setIsMhs] = useState(false);
    const pick = (v) => { form.setData('role', v); setIsMhs(v === 'mahasiswa'); };
    const submit = (e) => { e.preventDefault(); form.post(route('user.store')); };
    const input = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]';
    return (
        <AdminLayout title="Tambah User">
            <PageHeader title="Tambah User" subtitle="Tambahkan akun pengguna baru ke sistem." actions={[{ label: 'Kembali', href: route('user.index'), variant: 'secondary' }]} />
            <form onSubmit={submit} className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
                <div className="mb-3"><label className="mb-1 block text-sm font-semibold">Role</label>
                    <select value={form.data.role} onChange={(e) => pick(e.target.value)} required className={input}>
                        <option value="">Pilih Role</option>
                        <option value="admin">Admin</option><option value="ketua">Kepala Lembaga</option>
                        <option value="staff">Kabid Viktor</option><option value="staff_serang">Kabid Serang</option>
                        <option value="mahasiswa">Mahasiswa</option>
                    </select>
                </div>
                {!isMhs && (
                    <div className="mb-3">
                        <label className="mb-1 block text-sm font-semibold">Username</label>
                        <input value={form.data.username} onChange={(e) => form.setData('username', e.target.value)} placeholder="Masukkan username" className={input} />
                        {form.errors.username && <p className="mt-1 text-xs text-rose-500">{form.errors.username}</p>}
                    </div>
                )}
                {isMhs && (
                    <div className="mb-3">
                        <label className="mb-1 block text-sm font-semibold">Pilih Mahasiswa</label>
                        <select value={form.data.idMahasiswa} onChange={(e) => form.setData('idMahasiswa', e.target.value)} className={input}>
                            <option value="">Pilih data mahasiswa</option>
                            {(Array.isArray(mahasiswa) ? mahasiswa : []).map((m) => <option key={m.idMahasiswa} value={m.idMahasiswa}>{m.nim} - {m.nama} ({m.jurusan})</option>)}
                        </select>
                        <small className="text-slate-500">Username otomatis memakai NIM. Password default: lld#6digitakhirNIM.</small>
                        {form.errors.idMahasiswa && <p className="mt-1 text-xs text-rose-500">{form.errors.idMahasiswa}</p>}
                    </div>
                )}
                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Email Pengguna (untuk reset password)</label>
                    <input
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        placeholder="user@unpam.ac.id"
                        className={input}
                    />
                    {form.errors.email && <p className="mt-1 text-xs text-rose-500">{form.errors.email}</p>}
                </div>
                <div className="mb-3 rounded-xl bg-blue-50 p-3 text-sm"><strong>Password Default:</strong><ul className="ml-4 list-disc"><li>Admin — <b>lld#staff</b></li><li>Kabid Viktor — <b>lld#viktor</b></li><li>Kabid Serang — <b>lld#serang</b></li><li>Kepala Lembaga — <b>lld#kalem</b></li><li>Mahasiswa — <b>lld#6digitakhirNIM</b></li></ul></div>
                <div className="flex gap-2"><button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white"><i className="bi bi-check-circle mr-1" />Simpan</button><Link href={route('user.index')} className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold">Kembali</Link></div>
            </form>
        </AdminLayout>
    );
}
