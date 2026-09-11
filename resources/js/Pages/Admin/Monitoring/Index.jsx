import { Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';

function latestAkademik(m) {
    const direct = m?.akademik_terbaru || m?.akademikTerbaru || null;
    if (direct && typeof direct === 'object') return direct;
    if (Array.isArray(m?.akademik) && m.akademik.length > 0) return m.akademik[m.akademik.length - 1];
    if (m?.akademik && typeof m.akademik === 'object') return m.akademik;
    return {};
}

export default function Index({ total = 0, rataIpk = 0, jumlahBermasalah = 0, jumlahTerlambat = 0, aktif = 0, cuti = 0, nonaktif = 0, lulus = 0, labels = [], values = [], mahasiswa = {} }) {
    const paginator = mahasiswa && typeof mahasiswa === 'object' ? mahasiswa : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const links = Array.isArray(paginator.links) ? paginator.links : [];
    const chartLabels = Array.isArray(labels) ? labels : [];
    const chartValues = Array.isArray(values) ? values : [];
    const maxVal = Math.max(4, ...chartValues.map((v) => Number(v) || 0));
    return (
        <AdminLayout title="Monitoring Studi">
            <PageHeader title="Monitoring Studi" subtitle="Pantau perkembangan akademik mahasiswa." />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[['Total Mahasiswa', total, ''], ['Rata-rata IPK', Number(rataIpk || 0).toFixed(2), ''], ['Bermasalah', jumlahBermasalah, 'text-red-600'], ['Terlambat', jumlahTerlambat, 'text-yellow-600']].map(([l, v, c]) => (
                    <div key={l} className="rounded-2xl bg-white p-4 text-center shadow-sm"><h6 className="text-sm text-slate-500">{l}</h6><h3 className={`text-2xl font-bold ${c}`}>{v}</h3></div>
                ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[['Aktif', aktif, 'text-green-600 bg-green-50'], ['Cuti', cuti, 'text-yellow-600 bg-yellow-50'], ['Nonaktif', nonaktif, 'text-red-600 bg-red-50'], ['Lulus', lulus, 'text-blue-600 bg-blue-50']].map(([l, v, c]) => (
                    <div key={l} className={`rounded-2xl p-4 text-center shadow-sm ${c}`}><h6 className="font-bold">{l}</h6><h2 className="text-2xl font-bold">{v}</h2></div>
                ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/admin/monitoring/lulus" className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563eb]">Lulus</Link>
                <Link href="/admin/monitoring/terlambat" className="rounded-xl bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700">Terlambat</Link>
                <Link href="/admin/monitoring/bermasalah" className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">Bermasalah</Link>
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <h6 className="font-bold">Rata-rata IPK per Semester</h6>
                {chartLabels.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">Belum ada data akademik.</p>
                ) : (
                    <div className="mt-3 flex items-end gap-2 overflow-x-auto pb-1">
                        {chartLabels.map((lab, i) => {
                            const val = Number(chartValues[i] || 0);
                            return (
                                <div key={i} className="flex min-w-[52px] flex-1 flex-col items-center gap-1">
                                    <span className="text-xs font-semibold text-slate-600">{val.toFixed(2)}</span>
                                    <div className="flex h-36 w-full items-end rounded-lg bg-slate-100">
                                        <div className="w-full rounded-lg bg-[#2563eb]" style={{ height: `${Math.min(100, (val / maxVal) * 100)}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-500">Smt {lab}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <h6 className="font-bold">Daftar Mahasiswa</h6>
                <div className="mt-2">
                    <DataTable searchable={false} paginate={false} data={rows} columns={[
                        { key: 'nim', label: 'NIM' }, { key: 'nama', label: 'Nama' },
                        { key: 'jurusan', label: 'Jurusan', render: (r) => r?.jurusan || '-' },
                        { label: 'Semester', render: (r) => latestAkademik(r)?.semester ?? '-' },
                        { label: 'IPK', render: (r) => latestAkademik(r)?.ipk ?? '-' },
                        { label: 'Status', render: (r) => <Badge status={r?.status || 'aktif'} /> },
                        {
                            label: 'Aksi',
                            render: (r) => (
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/monitoring/${r?.idMahasiswa ?? ''}`}
                                        title="Lihat Detail Monitoring"
                                        className="rounded-lg p-1.5 text-[#2563eb] hover:bg-blue-50 hover:text-blue-700 transition"
                                    >
                                        <i className="bi bi-eye text-base leading-none" />
                                    </Link>
                                </div>
                            ),
                        },
                    ]} emptyTitle="Belum ada data mahasiswa" />
                    <Pagination paginator={paginator} />
                </div>
            </div>
        </AdminLayout>
    );
}
