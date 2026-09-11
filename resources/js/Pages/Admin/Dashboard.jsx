import AdminLayout from '../../Layouts/AdminLayout';
import StatCard from '../../Components/StatCard';
import EmptyState from '../../Components/EmptyState';

export default function Dashboard({ total = 0, netra = 0, rungu = 0, daksa = 0, jurusan = {}, aktivitasTerbaru = [] }) {
    const acts = Array.isArray(aktivitasTerbaru) ? aktivitasTerbaru : [];
    const jurusanEntries = jurusan && typeof jurusan === 'object' ? Object.entries(jurusan) : [];
    const maxJ = Math.max(1, ...jurusanEntries.map(([, v]) => Number(v) || 0));
    return (
        <AdminLayout title="Dashboard">
            <div className="mb-4">
                <h2 className="text-xl font-bold md:text-2xl">Selamat Datang</h2>
                <p className="text-sm text-slate-500">Ringkasan data mahasiswa LLD UNPAM.</p>
            </div>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                <StatCard icon="bi-people-fill" label="Total Mahasiswa" value={total} color="bg-[#2196f3]" />
                <StatCard icon="bi-eye-fill" label="Netra" value={netra} color="bg-[#7c3aed]" />
                <StatCard icon="bi-ear-fill" label="Rungu" value={rungu} color="bg-[#f59e0b]" />
                <StatCard icon="bi-person-wheelchair" label="Daksa" value={daksa} color="bg-[#10b981]" />
            </div>
            <div className="mt-4 rounded-3xl border-0 bg-white p-4 shadow-sm md:p-6">
                <h5 className="font-bold">Persebaran Mahasiswa per Jurusan</h5>
                <small className="text-slate-500">Statistik jumlah mahasiswa berdasarkan program studi</small>
                <div className="mt-4 space-y-2">
                    {jurusanEntries.length === 0 && <p className="text-sm text-slate-400">Belum ada data jurusan.</p>}
                    {jurusanEntries.map(([k, v]) => (
                        <div key={k}>
                            <div className="flex justify-between text-sm"><span>{k}</span><strong>{v}</strong></div>
                            <div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-[#3b82f6]" style={{ width: `${(Number(v) / maxJ) * 100}%` }} /></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm md:p-6">
                <h4 className="font-bold">Aktivitas Terakhir</h4>
                <small className="text-slate-500">Aktivitas realtime sistem</small>
                <div className="mt-2">
                    {acts.length === 0 ? <EmptyState title="Belum ada aktivitas terbaru" message="Aktivitas sistem akan muncul di sini." /> : acts.map((a, i) => (
                        <div key={i} className="flex items-start gap-3 border-b border-slate-100 py-3">
                            <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                            <div className="flex-1"><div className="text-sm">{a?.aktivitas || '-'}</div><small className="text-slate-500">{a?.created_at || ''}</small></div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
