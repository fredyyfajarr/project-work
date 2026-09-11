import { Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import Pagination from '../../../Components/Pagination';

function latestAkademik(m) {
    const direct = m?.akademik_terbaru || m?.akademikTerbaru || null;
    if (direct && typeof direct === 'object') return direct;
    if (Array.isArray(m?.akademik) && m.akademik.length > 0) return m.akademik[m.akademik.length - 1];
    if (m?.akademik && typeof m.akademik === 'object') return m.akademik;
    return {};
}

export default function Lulus({ data = {} }) {
    const paginator = data && typeof data === 'object' ? data : {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    const links = Array.isArray(paginator.links) ? paginator.links : [];
    return (
        <AdminLayout title="Mahasiswa Lulus">
            <PageHeader
                title="Mahasiswa Lulus"
                subtitle="Daftar mahasiswa dengan status lulus."
                actions={[{ label: 'Kembali', href: '/admin/monitoring', variant: 'secondary' }]}
            />
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full min-w-[720px] align-middle text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-slate-500">
                                <th className="px-4 py-3 font-semibold">NIM</th>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Jurusan</th>
                                <th className="px-4 py-3 font-semibold">Semester</th>
                                <th className="px-4 py-3 font-semibold">IPK</th>
                                <th className="px-4 py-3 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((m, i) => {
                                const ak = latestAkademik(m);
                                return (
                                    <tr key={m?.idMahasiswa || m?.id || i} className="border-t border-slate-100 hover:bg-blue-50/40">
                                        <td className="px-4 py-3">{m?.nim || '-'}</td>
                                        <td className="px-4 py-3 font-semibold">{m?.nama || '-'}</td>
                                        <td className="px-4 py-3">{m?.jurusan || '-'}</td>
                                        <td className="px-4 py-3">{ak?.semester ?? '-'}</td>
                                        <td className="px-4 py-3 font-semibold">{ak?.ipk ?? '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/admin/monitoring/${m?.idMahasiswa ?? ''}`}
                                                    title="Lihat Detail Monitoring"
                                                    className="rounded-lg p-1.5 text-[#2563eb] hover:bg-blue-50 hover:text-blue-700 transition"
                                                >
                                                    <i className="bi bi-eye text-base leading-none" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {rows.length === 0 && (
                                <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400">Tidak ada data.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination paginator={paginator} />
            </div>
        </AdminLayout>
    );
}
