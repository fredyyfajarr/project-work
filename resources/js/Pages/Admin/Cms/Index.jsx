import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Badge from '../../../Components/Badge';
import { confirmAction } from '../../../lib/confirm';

export default function Index({ items = {}, definitions = {} }) {
    const defs = definitions && typeof definitions === 'object' ? definitions : {};
    const menuSlugs = Object.keys(defs);
    const grouped = items && typeof items === 'object' ? items : {};
    const rows = Object.entries(grouped).flatMap(([slug, arr]) => (Array.isArray(arr) ? arr : []).map((it) => ({ ...(it || {}), _menu: slug })));
    const form = useForm({ menu_slug: menuSlugs[0] || '', judul: '', deskripsi: '', link_berita: '', urutan: 1, status: 'aktif', gambar: null });
    const allowLink = defs[form.data.menu_slug]?.allow_link || false;
    const submit = (e) => { e.preventDefault(); form.post('/admin/cms', { forceFormData: true, onSuccess: () => form.reset('judul', 'deskripsi', 'link_berita', 'gambar') }); };

    const hapus = (id) => {
        confirmAction({
            title: 'Hapus Konten CMS',
            message: 'Apakah Anda yakin ingin menghapus konten ini dari website company profile?',
            confirmText: 'Ya, Hapus',
            type: 'danger',
            onConfirm: () => router.delete(`/admin/cms/${id}`),
        });
    };
    return (
        <AdminLayout title="Kelola CMS">
            <PageHeader title="Kelola CMS" subtitle="Kelola konten company profile: berita, kerja sama, pelatihan, program." />
            <form onSubmit={submit} className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <h5 className="font-bold">Tambah Konten</h5>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <select value={form.data.menu_slug} onChange={(e) => form.setData('menu_slug', e.target.value)} required className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="">Pilih Lokasi Menu</option>
                        {menuSlugs.map((slug) => <option key={slug} value={slug}>{defs[slug]?.nama_menu || slug} ({defs[slug]?.kategori || '-'})</option>)}
                    </select>
                    <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                    </select>
                    <input value={form.data.judul} onChange={(e) => form.setData('judul', e.target.value)} placeholder="Judul konten" required className="rounded-xl border px-3 py-2.5 text-sm md:col-span-2" />
                    <textarea value={form.data.deskripsi} onChange={(e) => form.setData('deskripsi', e.target.value)} placeholder="Deskripsi" rows="3" className="rounded-xl border px-3 py-2.5 text-sm md:col-span-2" />
                    {allowLink && <input value={form.data.link_berita} onChange={(e) => form.setData('link_berita', e.target.value)} placeholder="Link berita lengkap (https://...)" className="rounded-xl border px-3 py-2.5 text-sm md:col-span-2" />}
                    <input type="number" min="1" value={form.data.urutan} onChange={(e) => form.setData('urutan', e.target.value)} placeholder="Urutan" className="rounded-xl border px-3 py-2.5 text-sm" />
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => form.setData('gambar', e.target.files[0])} className="rounded-xl border px-3 py-2.5 text-sm" />
                </div>
                <button className="mt-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">Simpan Konten</button>
            </form>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <DataTable data={rows} columns={[
                    { label: 'Menu', render: (r) => defs[r?._menu || r?.menu_slug]?.nama_menu || r?.nama_menu || r?.menu_slug || '-' },
                    { key: 'judul', label: 'Judul' },
                    { key: 'kategori', label: 'Kategori', render: (r) => r?.kategori || '-' },
                    { key: 'urutan', label: 'Urutan', render: (r) => r?.urutan ?? '-' },
                    { key: 'status', label: 'Status', render: (r) => <Badge status={r?.status || 'aktif'} /> },
                    { label: 'Aksi', render: (r) => (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => hapus(r?.idCms || r?.id)}
                                title="Hapus Konten"
                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                            >
                                <i className="bi bi-trash text-base leading-none" />
                            </button>
                        </div>
                    ) },
                ]} emptyTitle="Belum ada konten CMS" />
            </div>
        </AdminLayout>
    );
}
