import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';
import { confirmAction } from '../../../lib/confirm';

export default function Index({ luaran = {}, mahasiswa = [], totalPending = 0, totalDiterima = 0, totalDitolak = 0, filters = {} }) {
    const paginator = luaran && typeof luaran === 'object' ? luaran : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const links = Array.isArray(paginator.links) ? paginator.links : [];
    const mahasiswaList = Array.isArray(mahasiswa) ? mahasiswa : [];
    const f = useForm({ search: filters?.search || '', status: filters?.status || '' });
    const tambah = useForm({ idMahasiswa: '', judul: '', jenisLuaran: 'Prestasi', tingkat: '', tahun: new Date().getFullYear(), deskripsi: '' });
    const submitTambah = (e) => { e.preventDefault(); tambah.post('/admin/luaran', { onSuccess: () => tambah.reset('judul', 'tingkat', 'deskripsi') }); };

    const validasi = (id, status) => {
        confirmAction({
            title: 'Validasi Luaran',
            message: `Ubah status luaran mahasiswa ini menjadi "${status.toUpperCase()}"?`,
            confirmText: `Ya, ${status === 'diterima' ? 'Terima' : 'Tolak'}`,
            type: status === 'ditolak' ? 'danger' : 'info',
            onConfirm: () => router.post(`/admin/luaran/validasi/${id}/${status}`),
        });
    };

    const hapus = (id) => {
        confirmAction({
            title: 'Hapus Data Luaran',
            message: 'Apakah Anda yakin ingin menghapus data luaran prestasi ini?',
            confirmText: 'Ya, Hapus',
            type: 'danger',
            onConfirm: () => router.delete(`/admin/luaran/${id}`),
        });
    };
    return (
        <AdminLayout title="Validasi Luaran">
            <PageHeader title="Validasi Luaran" subtitle="Validasi luaran prestasi / karya yang dikirim mahasiswa." />
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                {[['Pending', totalPending, 'text-yellow-600 bg-yellow-50'], ['Diterima', totalDiterima, 'text-green-600 bg-green-50'], ['Ditolak', totalDitolak, 'text-red-600 bg-red-50']].map(([l, v, c]) => (
                    <div key={l} className={`rounded-2xl p-4 text-center shadow-sm ${c}`}><h6 className="font-bold">{l}</h6><h2 className="text-2xl font-bold">{v}</h2></div>
                ))}
            </div>
            <form onSubmit={submitTambah} className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <h5 className="font-bold">Tambah Luaran Manual</h5>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                    <select value={tambah.data.idMahasiswa} onChange={(e) => tambah.setData('idMahasiswa', e.target.value)} required className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Pilih Mahasiswa</option>
                        {mahasiswaList.map((m) => <option key={m.idMahasiswa} value={m.idMahasiswa}>{m.nim} - {m.nama}</option>)}
                    </select>
                    <input value={tambah.data.judul} onChange={(e) => tambah.setData('judul', e.target.value)} placeholder="Judul luaran" required className="rounded-xl border px-3 py-2.5 text-sm md:col-span-2" />
                    <select value={tambah.data.jenisLuaran} onChange={(e) => tambah.setData('jenisLuaran', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        {['Prestasi', 'Publikasi Ilmiah', 'Media Massa', 'Karya Kreatif', 'HAKI / Paten', 'Kompetisi & Lomba', 'Kewirausahaan / Bisnis', 'Lainnya'].map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <input value={tambah.data.tingkat} onChange={(e) => tambah.setData('tingkat', e.target.value)} placeholder="Tingkat" className="rounded-xl border px-3 py-2.5 text-sm" />
                    <input type="number" value={tambah.data.tahun} onChange={(e) => tambah.setData('tahun', e.target.value)} placeholder="Tahun" className="rounded-xl border px-3 py-2.5 text-sm" />
                    <input value={tambah.data.deskripsi} onChange={(e) => tambah.setData('deskripsi', e.target.value)} placeholder="Deskripsi (opsional)" className="rounded-xl border px-3 py-2.5 text-sm md:col-span-3" />
                </div>
                <button className="mt-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">Simpan Luaran</button>
            </form>
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <form onSubmit={(e) => { e.preventDefault(); f.get('/admin/luaran'); }} className="grid gap-2 md:grid-cols-3">
                    <input value={f.data.search} onChange={(e) => f.setData('search', e.target.value)} placeholder="Cari judul / nama mahasiswa" className="rounded-xl border px-3 py-2.5 text-sm md:col-span-2" />
                    <select value={f.data.status} onChange={(e) => f.setData('status', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Semua Status</option>
                        {['pending', 'diterima', 'ditolak'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </form>
                <div className="mt-2"><button onClick={(e) => { e.preventDefault(); f.get('/admin/luaran'); }} className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">Cari</button></div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <DataTable searchable={false} paginate={false} data={rows} columns={[
                    { key: 'judul', label: 'Judul' },
                    { label: 'Mahasiswa', render: (r) => r?.mahasiswa?.nama || r?.nama || '-' },
                    { key: 'jenisLuaran', label: 'Jenis', render: (r) => r?.jenisLuaran || r?.jenis || '-' },
                    { key: 'tahun', label: 'Tahun', render: (r) => r?.tahun ?? '-' },
                    { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || 'pending'} /> },
                    { label: 'Aksi', render: (r) => (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => validasi(r?.idLuaran || r?.id, 'diterima')}
                                title="Terima / Validasi Luaran"
                                className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                            >
                                <i className="bi bi-check-circle text-base leading-none" />
                            </button>
                            <button
                                onClick={() => validasi(r?.idLuaran || r?.id, 'ditolak')}
                                title="Tolak Luaran"
                                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                            >
                                <i className="bi bi-x-circle text-base leading-none" />
                            </button>
                            <button
                                onClick={() => hapus(r?.idLuaran || r?.id)}
                                title="Hapus Luaran"
                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                            >
                                <i className="bi bi-trash text-base leading-none" />
                            </button>
                        </div>
                    ) },
                ]} emptyTitle="Belum ada luaran" />
                <Pagination paginator={paginator} />
            </div>
        </AdminLayout>
    );
}
