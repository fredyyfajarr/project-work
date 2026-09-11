import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';

function columnsFor(jenis) {
    if (jenis === 'luaran') {
        return [
            { label: 'NIM', render: (r) => r?.mahasiswa?.nim || '-' },
            { label: 'Nama', render: (r) => r?.mahasiswa?.nama || '-' },
            { key: 'judul', label: 'Judul' },
            { key: 'jenisLuaran', label: 'Jenis', render: (r) => r?.jenisLuaran || '-' },
            { key: 'tahun', label: 'Tahun', render: (r) => r?.tahun ?? '-' },
            { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || 'pending'} /> },
        ];
    }
    if (jenis === 'nomor_surat') {
        return [
            { key: 'nomorSurat', label: 'Nomor Surat', render: (r) => r?.nomorSurat || '-' },
            { key: 'jenisSurat', label: 'Jenis', render: (r) => r?.jenisSurat || '-' },
            { key: 'perihal', label: 'Perihal' },
            { key: 'tanggalSurat', label: 'Tanggal', render: (r) => r?.tanggalSurat || '-' },
            { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || '-'} /> },
        ];
    }
    return [
        { key: 'nim', label: 'NIM' }, { key: 'nama', label: 'Nama' },
        { key: 'jurusan', label: 'Jurusan', render: (r) => r?.jurusan || '-' },
        { label: 'IPK Terakhir', render: (r) => r?.akademikTerbaru?.ipk ?? r?.akademik_terbaru?.ipk ?? '-' },
        { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || '-'} /> },
    ];
}

export default function Index({ jenis = null, jenisList = [], jurusan = [], data = null, filters = {} }) {
    const paginator = data && typeof data === 'object' ? data : null;
    const rows = paginator && Array.isArray(paginator.data) ? paginator.data : [];
    const links = paginator && Array.isArray(paginator.links) ? paginator.links : [];
    const list = Array.isArray(jenisList) && jenisList.length > 0 ? jenisList : ['mahasiswa', 'akademik', 'monitoring', 'luaran', 'nomor_surat'];
    const jurusanList = Array.isArray(jurusan) ? jurusan : [];
    const f = useForm({
        jenis: filters?.jenis || jenis || 'mahasiswa',
        jurusan: filters?.jurusan || '',
        disabilitas: filters?.disabilitas || '',
        status: filters?.status || '',
        kondisi_ipk: filters?.kondisi_ipk || '',
        tahun: filters?.tahun || '',
    });
    const activeJenis = f.data.jenis || jenis || 'mahasiswa';
    const exportUrl = `/admin/laporan/export?${new URLSearchParams(Object.fromEntries(Object.entries(f.data).filter(([, v]) => v !== ''))).toString()}`;
    return (
        <AdminLayout title="Kelola Laporan">
            <PageHeader title="Kelola Laporan" subtitle="Rekap data mahasiswa, akademik, monitoring, luaran, dan nomor surat." actions={[{ label: 'Export Excel', href: exportUrl, icon: 'bi-file-earmark-excel', variant: 'success' }]} />
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <form onSubmit={(e) => { e.preventDefault(); f.get('/admin/laporan'); }} className="grid gap-2 md:grid-cols-4">
                    <select value={f.data.jenis} onChange={(e) => f.setData('jenis', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        {list.map((j) => <option key={j} value={j}>{j.replace(/_/g, ' ')}</option>)}
                    </select>
                    <select value={f.data.jurusan} onChange={(e) => f.setData('jurusan', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Jurusan</option>
                        {jurusanList.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <select value={f.data.status} onChange={(e) => f.setData('status', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Status</option>
                        {['aktif', 'cuti', 'nonaktif', 'lulus', 'pending', 'diterima', 'ditolak', 'draft', 'keluar', 'arsip'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={f.data.kondisi_ipk} onChange={(e) => f.setData('kondisi_ipk', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Kondisi IPK</option>
                        <option value="bermasalah">Bermasalah (&lt; 2.75)</option>
                        <option value="aman">Aman (&gt;= 2.75)</option>
                    </select>
                    <select value={f.data.disabilitas} onChange={(e) => f.setData('disabilitas', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Disabilitas</option>
                        {['Netra', 'Rungu', 'Daksa', 'Grahita', 'Lainnya'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input value={f.data.tahun} onChange={(e) => f.setData('tahun', e.target.value)} placeholder="Tahun (nomor surat)" className="rounded-xl border px-3 py-2.5 text-sm" />
                    <button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white md:col-span-2">Tampilkan Laporan</button>
                </form>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                {!jenis ? (
                    <p className="py-6 text-center text-sm text-slate-500">Pilih jenis laporan lalu klik Tampilkan Laporan.</p>
                ) : (
                    <>
                        <DataTable searchable={false} paginate={false} data={rows} columns={columnsFor(activeJenis)} emptyTitle="Belum ada data laporan" />
                        <Pagination paginator={paginator} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
