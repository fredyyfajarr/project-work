import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import { route } from '../../../lib/route';
import { confirmAction } from '../../../lib/confirm';

export default function Show({ mahasiswa = {}, riwayat = [], akademik = null }) {
    const m = mahasiswa || {};
    const rows = Array.isArray(riwayat) ? riwayat : (Array.isArray(akademik) ? akademik : []);
    const form = useForm({ idMahasiswa: m.idMahasiswa || '', semester: '', ips: '', ipk: '' });
    const [editItem, setEditItem] = useState(null);
    const editForm = useForm({ idMahasiswa: m.idMahasiswa || '', semester: '', ips: '', ipk: '' });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('akademik.store'), {
            onSuccess: () => form.reset('semester', 'ips', 'ipk'),
        });
    };

    const startEdit = (r) => {
        setEditItem(r);
        editForm.setData({
            idMahasiswa: m.idMahasiswa || '',
            semester: r?.semester ?? '',
            ips: r?.ips ?? '',
            ipk: r?.ipk ?? '',
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editItem) return;
        editForm.put(`/admin/akademik/${editItem.idAkademik}`, {
            onSuccess: () => setEditItem(null),
        });
    };

    const hapus = (id) => {
        confirmAction({
            title: 'Hapus Data Akademik',
            message: 'Apakah Anda yakin ingin menghapus data akademik semester ini? Data IPS & IPK terkait akan dihapus.',
            confirmText: 'Ya, Hapus',
            type: 'danger',
            onConfirm: () => router.delete(`/admin/akademik/${id}`),
        });
    };

    return (
        <AdminLayout title="Kelola Akademik">
            <PageHeader
                title="Kelola Akademik"
                subtitle="Riwayat akademik mahasiswa per semester."
                actions={[{ label: 'Kembali', href: route('akademik.index'), variant: 'secondary' }]}
            />
            <div className="mb-4 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#2563eb] text-3xl font-bold text-white">
                    {String(m.nama || '?').slice(0, 1).toUpperCase()}
                </div>
                <div>
                    <h4 className="font-bold">{m.nama || '-'}</h4>
                    <div className="text-sm text-slate-500">{m.nim || '-'}</div>
                    <div className="text-sm">{m.jurusan || '-'}</div>
                </div>
            </div>

            <form onSubmit={submit} className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
                <h5 className="font-bold">Tambah Data Akademik</h5>
                <div className="mt-2 grid gap-3 md:grid-cols-4">
                    <div>
                        <label className="text-sm font-semibold">Semester</label>
                        <input
                            type="number"
                            min="1"
                            max="14"
                            value={form.data.semester}
                            onChange={(e) => form.setData('semester', e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">IPS</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={form.data.ips}
                            onChange={(e) => form.setData('ips', e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">IPK</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={form.data.ipk}
                            onChange={(e) => form.setData('ipk', e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 cursor-pointer transition disabled:opacity-50"
                        >
                            + Tambah
                        </button>
                    </div>
                </div>
            </form>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
                <DataTable
                    perPage={10}
                    data={rows}
                    columns={[
                        { key: 'semester', label: 'Semester', render: (r) => `Semester ${r?.semester ?? '-'}` },
                        { key: 'ips', label: 'IPS' },
                        { key: 'ipk', label: 'IPK' },
                        {
                            label: 'Aksi',
                            render: (r) => (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => startEdit(r)}
                                        title="Edit Nilai Semester"
                                        className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition cursor-pointer"
                                    >
                                        <i className="bi bi-pencil-square text-base leading-none" />
                                    </button>
                                    <button
                                        onClick={() => hapus(r?.idAkademik)}
                                        title="Hapus Data Semester Ini"
                                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                                    >
                                        <i className="bi bi-trash text-base leading-none" />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
                <Link href={route('akademik.index')} className="mt-3 inline-block text-sm text-[#2563eb] hover:underline">
                    ← Kembali ke daftar
                </Link>
            </div>

            {/* Modal Edit Nilai */}
            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h4 className="font-bold text-slate-800">Edit Data Akademik</h4>
                            <button
                                type="button"
                                onClick={() => setEditItem(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>
                        <form onSubmit={submitEdit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Semester</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="14"
                                    value={editForm.data.semester}
                                    onChange={(e) => editForm.setData('semester', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">IPS</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    value={editForm.data.ips}
                                    onChange={(e) => editForm.setData('ips', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">IPK</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    value={editForm.data.ipk}
                                    onChange={(e) => editForm.setData('ipk', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditItem(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
