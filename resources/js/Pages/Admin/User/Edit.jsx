import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import { route } from '../../../lib/route';

export default function Edit({ user = {}, mahasiswa = [] }) {
    const u = user || {};
    const mahasiswaList = Array.isArray(mahasiswa) ? mahasiswa : [];
    const isMhsRole = (r) => r === 'mahasiswa';
    const form = useForm({
        role: u.role || '',
        username: u.username || '',
        email: u.email || u.mahasiswa?.email || '',
        status: u.status || 'aktif',
        idMahasiswa: u.idMahasiswa || '',
        password: '',
    });
    const submit = (e) => { e.preventDefault(); form.put(route('user.update', u.idUser || u.id)); };
    const input = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]';
    return (
        <AdminLayout title="Edit User">
            <PageHeader title="Edit User" subtitle={u.username || ''} actions={[{ label: 'Kembali', href: route('user.index'), variant: 'secondary' }]} />
            <form onSubmit={submit} className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
                <div className="mb-3"><label className="mb-1 block text-sm font-semibold">Role</label>
                    <select value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} required className={input}>
                        <option value="">Pilih Role</option>
                        <option value="admin">Admin</option><option value="ketua">Kepala Lembaga</option>
                        <option value="staff">Kabid Viktor</option><option value="staff_serang">Kabid Serang</option>
                        <option value="mahasiswa">Mahasiswa</option>
                    </select>
                </div>
                {!isMhsRole(form.data.role) && (
                    <div className="mb-3">
                        <label className="mb-1 block text-sm font-semibold">Username</label>
                        <input value={form.data.username} onChange={(e) => form.setData('username', e.target.value)} className={input} />
                        {form.errors.username && <p className="mt-1 text-xs text-rose-500">{form.errors.username}</p>}
                    </div>
                )}
                {isMhsRole(form.data.role) && (
                    <div className="mb-3"><label className="mb-1 block text-sm font-semibold">Mahasiswa (username otomatis = NIM)</label>
                        <select value={form.data.idMahasiswa} onChange={(e) => form.setData('idMahasiswa', e.target.value)} className={input}>
                            <option value="">Pilih data mahasiswa</option>
                            {mahasiswaList.map((m) => <option key={m.idMahasiswa} value={m.idMahasiswa}>{m.nim} - {m.nama}</option>)}
                        </select>
                        {form.errors.idMahasiswa && <p className="mt-1 text-xs text-rose-500">{form.errors.idMahasiswa}</p>}
                    </div>
                )}
                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Email Akun (untuk reset password)</label>
                    <input
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        placeholder="user@unpam.ac.id"
                        className={input}
                    />
                    {form.errors.email && <p className="mt-1 text-xs text-rose-500">{form.errors.email}</p>}
                </div>
                <div className="mb-3"><label className="mb-1 block text-sm font-semibold">Status</label>
                    <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} required className={input}>
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                    </select>
                </div>
                <div className="mb-3"><label className="mb-1 block text-sm font-semibold">Password Baru (opsional)</label><input type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} placeholder="Kosongkan jika tidak diganti" className={input} /></div>
                <div className="flex gap-2"><button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">Update</button><Link href={route('user.index')} className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold">Batal</Link></div>
            </form>
        </AdminLayout>
    );
}
