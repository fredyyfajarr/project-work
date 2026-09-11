import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import { route } from '../../../lib/route';

export default function Preview({ mapped = [], valid = 0, invalid = 0 }) {
    const rows = Array.isArray(mapped) ? mapped : [];
    const nValid = valid ?? rows.filter((r) => r?.status === 'valid').length;
    const nInvalid = invalid ?? rows.filter((r) => r?.status !== 'valid').length;
    const form = useForm({});
    const confirm = (e) => {
        e.preventDefault();
        form.post(route('admin.akademik.import'));
    };
    return (
        <AdminLayout title="Preview Import Akademik">
            <PageHeader
                title="Preview Import Akademik"
                subtitle="Periksa data Excel sebelum disimpan ke database."
                actions={[{ label: 'Kembali', href: route('admin.akademik.index'), variant: 'secondary' }]}
            />
            <div className="mb-4 rounded-2xl bg-white p-4 text-sm shadow-sm">
                <strong>Total:</strong> {rows.length}
                {' | '}
                <span className="font-semibold text-green-600">Valid: {nValid}</span>
                {' | '}
                <span className="font-semibold text-red-600">Invalid: {nInvalid}</span>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full min-w-[720px] align-middle text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-slate-500">
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">NIM</th>
                                <th className="px-4 py-3 font-semibold">Semester</th>
                                <th className="px-4 py-3 font-semibold">IPS</th>
                                <th className="px-4 py-3 font-semibold">IPK</th>
                                <th className="px-4 py-3 font-semibold">Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((item, i) => (
                                <tr key={i} className={`border-t border-slate-100 ${item?.status === 'valid' ? 'bg-green-50/60' : 'bg-red-50/60'}`}>
                                    <td className="px-4 py-3 font-semibold">{item?.status || '-'}</td>
                                    <td className="px-4 py-3">{item?.data?.nim ?? '-'}</td>
                                    <td className="px-4 py-3">{item?.data?.semester ?? '-'}</td>
                                    <td className="px-4 py-3">{item?.data?.ips ?? '-'}</td>
                                    <td className="px-4 py-3">{item?.data?.ipk ?? '-'}</td>
                                    <td className="px-4 py-3">{item?.error || '-'}</td>
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400">Tidak ada baris preview.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {rows.length > 0 && (
                    <form onSubmit={confirm} className="mt-3 flex gap-2">
                        <button disabled={form.processing} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white">
                            Simpan ke Database
                        </button>
                        <Link href={route('admin.akademik.index')} className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold">
                            Kembali
                        </Link>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
