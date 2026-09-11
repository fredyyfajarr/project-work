import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import Badge from '../../../Components/Badge';
import { route } from '../../../lib/route';

export default function Index({ data = {} }) {
    const paginator = data && typeof data === 'object' ? data : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const links = Array.isArray(paginator.links) ? paginator.links : [];
    return (
        <AdminLayout title="Nomor Surat">
            <PageHeader title="Nomor Surat" subtitle="Kelola penomoran surat resmi LLD." actions={[{ label: '+ Tambah Nomor', href: route('nomor-surat.create') }]} />
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <DataTable searchable={false} paginate={false} data={rows} columns={[
                    { key: 'nomorSurat', label: 'Nomor Surat', render: (r) => r?.nomorSurat || '-' },
                    { key: 'jenisSurat', label: 'Jenis', render: (r) => r?.jenisSurat || '-' },
                    { key: 'perihal', label: 'Perihal' },
                    { key: 'tanggalSurat', label: 'Tanggal', render: (r) => r?.tanggalSurat || '-' },
                    { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || 'draft'} /> },
                    { key: 'keterangan', label: 'Keterangan', render: (r) => r?.keterangan || '-' },
                ]} emptyTitle="Belum ada nomor surat" />
                <Pagination paginator={paginator} />
            </div>
        </AdminLayout>
    );
}
