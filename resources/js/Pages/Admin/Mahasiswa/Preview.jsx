import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import { route } from '../../../lib/route';

export default function Preview({ mapped = [], stats = {}, headers = [] }) {
    const rows = Array.isArray(mapped) ? mapped : [];
    const form = useForm({});
    const confirm = (e) => { e.preventDefault(); form.post(route('admin.mahasiswa.import')); };
    const cancel = () => { router.post(route('admin.mahasiswa.cancel')); };
    return (
        <AdminLayout title="Preview Import">
            <PageHeader title="Preview Import Mahasiswa" subtitle="Periksa data Excel sebelum disimpan." actions={[{ label: 'Kembali', href: route('mahasiswa.index'), variant: 'secondary' }]} />
            <div className="mb-4 rounded-3xl bg-white p-4 text-sm shadow-sm md:p-5">
                <strong>Total:</strong> {stats?.total ?? rows.length}
                {' | '}
                <span className="font-semibold text-green-600">Valid: {stats?.valid ?? rows.filter((r) => r?.status === 'valid').length}</span>
                {' | '}
                <span className="font-semibold text-red-600">Invalid: {stats?.invalid ?? rows.filter((r) => r?.status !== 'valid').length}</span>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
                <DataTable searchable={false} perPage={100} data={rows} columns={[
                    { key: 'status', label: 'Status', render: (r) => r?.status || '-' },
                    { key: 'nim', label: 'NIM', render: (r) => r?.data?.nim || '-' },
                    { key: 'nama', label: 'Nama', render: (r) => r?.data?.nama_mahasiswa || '-' },
                    { key: 'jurusan', label: 'Program Studi', render: (r) => r?.data?.program_studi || '-' },
                    { key: 'disabilitas', label: 'Disabilitas', render: (r) => r?.data?.jenis_kebutuhan_khusus || '-' },
                    { key: 'error', label: 'Error', render: (r) => Array.isArray(r?.errors) ? r.errors.join(', ') || '-' : '-' },
                ]} emptyTitle="Tidak ada baris preview" />
                {rows.length > 0 && (
                    <div className="mt-3 flex gap-2">
                        <button onClick={confirm} disabled={form.processing} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white">Konfirmasi &amp; Simpan</button>
                        <button onClick={cancel} className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold">Batal</button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
