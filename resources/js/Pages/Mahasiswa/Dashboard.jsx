import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';

export default function Dashboard({ mahasiswa = {}, akademik = [], latest = null, luaranCount = 0, jadwalCount = 0, aspirasiCount = 0 }) {
    const m = mahasiswa || {};
    const rows = Array.isArray(akademik) ? akademik : [];
    const last = latest || rows[rows.length - 1] || null;
    const cards = [
        ['IPK Terakhir', last?.ipk != null ? Number(last.ipk).toFixed(2) : '-'],
        ['IPS Terakhir', last?.ips != null ? Number(last.ips).toFixed(2) : '-'],
        ['Semester', last?.semester ?? '-'],
        ['Luaran', luaranCount], ['Jadwal', jadwalCount ?? 0],
    ];
    return (
        <AdminLayout title="Dashboard Mahasiswa">
            <section className="rounded-3xl bg-gradient-to-r from-[#2563eb] to-[#1e40af] p-6 text-white">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Akun Mahasiswa</span>
                <h1 className="mt-2 text-xl font-bold md:text-2xl">Selamat Datang, {m.nama || 'Mahasiswa'}</h1>
                <p className="text-sm text-white/80">{m.jurusan || '-'} • Angkatan {m.angkatan || '-'} • {m.disabilitas || m.jenisHambatan || '-'}</p>
                <div className="mt-2"><Badge status={m.status || 'aktif'} /></div>
            </section>
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
                {cards.map(([l, v], idx) => (
                    <div
                        key={l}
                        className={`rounded-2xl bg-white p-4 text-center shadow-xs border border-slate-100 ${
                            idx === cards.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                        }`}
                    >
                        <span className="text-xs font-medium text-slate-500">{l}</span>
                        <div className="mt-1 text-2xl font-black text-[#2196f3]">{v}</div>
                    </div>
                ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100">
                    <h4 className="font-bold text-slate-800">Ringkasan Profil</h4>
                    {[['NIM', m.nim], ['Program Studi', m.jurusan], ['Aspirasi', `${aspirasiCount} data`]].map(([l, v]) => (
                        <div key={l} className="flex justify-between border-b border-slate-100 py-2.5 text-sm"><span className="text-slate-500">{l}</span><strong className="text-slate-800">{v || '-'}</strong></div>
                    ))}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Link href="/mahasiswa/profil" className="rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-4 py-2 text-xs font-bold text-white transition shadow-xs">Lihat Profil</Link>
                        <Link href="/mahasiswa/jadwal" className="rounded-xl border border-[#2196f3] px-4 py-2 text-xs font-bold text-[#1976d2] hover:bg-blue-50 transition">Kelola Jadwal</Link>
                    </div>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100">
                    <h4 className="font-bold text-slate-800">Riwayat Akademik</h4>
                    {rows.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada data akademik.</p> : (
                        <div className="mt-2 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase text-slate-400 border-b border-slate-100">
                                        <th className="pb-2">Semester</th>
                                        <th className="pb-2">IPS</th>
                                        <th className="pb-2">IPK</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.slice(0, 5).map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="py-2.5 font-medium text-slate-700">Semester {r?.semester}</td>
                                            <td className="py-2.5 font-semibold text-slate-800">{r?.ips}</td>
                                            <td className="py-2.5 font-bold text-[#2196f3]">{r?.ipk}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
