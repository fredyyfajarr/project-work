import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import Badge from '../../../Components/Badge';
import DataTable from '../../../Components/DataTable';

export default function Detail({ m = null, mahasiswa = null, akademik = null }) {
    const mhs = m || mahasiswa || {};
    const rows = Array.isArray(akademik) ? akademik : (Array.isArray(mhs.akademik) ? mhs.akademik : []);
    const kel = mhs.keluarga || {};
    return (
        <AdminLayout title="Detail Monitoring">
            <PageHeader title={mhs.nama || 'Detail Monitoring'} subtitle={mhs.nim || ''} actions={[{ label: 'Kembali', href: '/admin/monitoring', variant: 'secondary' }]} />
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2563eb] text-2xl font-bold text-white">{String(mhs.nama || '?').slice(0, 1).toUpperCase()}</div>
                    <div><h4 className="font-bold">{mhs.nama || '-'}</h4><p className="text-sm text-slate-500">{mhs.nim || '-'} • {mhs.jurusan || '-'}</p></div>
                    <Badge status={mhs.status || 'aktif'} />
                </div>
                {(kel.namaAyah || kel.namaIbu) && (
                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 px-4 py-2.5"><span className="text-slate-500">Ayah: </span><strong>{kel.namaAyah || '-'} ({kel.pekerjaanAyah || '-'})</strong></div>
                        <div className="rounded-xl bg-slate-50 px-4 py-2.5"><span className="text-slate-500">Ibu: </span><strong>{kel.namaIbu || '-'} ({kel.pekerjaanIbu || '-'})</strong></div>
                    </div>
                )}
                <div className="mt-4">
                    <DataTable data={rows} columns={[
                        { key: 'semester', label: 'Semester', render: (r) => `Semester ${r?.semester ?? '-'}` },
                        { key: 'ips', label: 'IPS', render: (r) => r?.ips ?? '-' },
                        { key: 'ipk', label: 'IPK', render: (r) => r?.ipk ?? '-' },
                        { label: 'Kondisi', render: (r) => <Badge status={Number(r?.ipk ?? 4) < 2.75 ? 'bermasalah' : 'aman'} /> },
                    ]} />
                </div>
            </div>
        </AdminLayout>
    );
}
