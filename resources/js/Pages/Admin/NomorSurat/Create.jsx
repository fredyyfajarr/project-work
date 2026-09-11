import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import { route } from '../../../lib/route';

export default function Create() {
    const form = useForm({ jenisSurat: '', kodePejabat: '', kodeSurat: '', kodePerihal: '', perihal: '', tujuanSurat: '', tanggalSurat: '', penandatangan: '', keterangan: '', status: 'draft' });
    const submit = (e) => { e.preventDefault(); form.post(route('nomor-surat.store')); };
    const input = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb]';
    return (
        <AdminLayout title="Tambah Nomor Surat">
            <PageHeader title="Tambah Nomor Surat" subtitle="Catat nomor surat resmi baru. Nomor urut dibuat otomatis oleh sistem." actions={[{ label: 'Kembali', href: route('nomor-surat.index'), variant: 'secondary' }]} />
            <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 md:p-6">
                <div><label className="mb-1 block text-sm font-semibold">Jenis Surat *</label><input value={form.data.jenisSurat} onChange={(e) => form.setData('jenisSurat', e.target.value)} required className={input} placeholder="Contoh: Surat Tugas" />{form.errors.jenisSurat && <div className="text-xs text-red-600">{form.errors.jenisSurat}</div>}</div>
                <div><label className="mb-1 block text-sm font-semibold">Perihal *</label><input value={form.data.perihal} onChange={(e) => form.setData('perihal', e.target.value)} required className={input} />{form.errors.perihal && <div className="text-xs text-red-600">{form.errors.perihal}</div>}</div>
                <div><label className="mb-1 block text-sm font-semibold">Kode Pejabat *</label><input value={form.data.kodePejabat} onChange={(e) => form.setData('kodePejabat', e.target.value)} required className={input} placeholder="Contoh: LLD" />{form.errors.kodePejabat && <div className="text-xs text-red-600">{form.errors.kodePejabat}</div>}</div>
                <div><label className="mb-1 block text-sm font-semibold">Kode Surat *</label><input value={form.data.kodeSurat} onChange={(e) => form.setData('kodeSurat', e.target.value)} required className={input} placeholder="Contoh: ST" />{form.errors.kodeSurat && <div className="text-xs text-red-600">{form.errors.kodeSurat}</div>}</div>
                <div><label className="mb-1 block text-sm font-semibold">Kode Perihal</label><input value={form.data.kodePerihal} onChange={(e) => form.setData('kodePerihal', e.target.value)} className={input} /></div>
                <div><label className="mb-1 block text-sm font-semibold">Tanggal Surat *</label><input type="date" value={form.data.tanggalSurat} onChange={(e) => form.setData('tanggalSurat', e.target.value)} required className={input} />{form.errors.tanggalSurat && <div className="text-xs text-red-600">{form.errors.tanggalSurat}</div>}</div>
                <div><label className="mb-1 block text-sm font-semibold">Tujuan Surat</label><input value={form.data.tujuanSurat} onChange={(e) => form.setData('tujuanSurat', e.target.value)} className={input} /></div>
                <div><label className="mb-1 block text-sm font-semibold">Penandatangan</label><input value={form.data.penandatangan} onChange={(e) => form.setData('penandatangan', e.target.value)} className={input} /></div>
                <div><label className="mb-1 block text-sm font-semibold">Status</label>
                    <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className={input}>
                        {['draft', 'keluar', 'arsip'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2"><label className="mb-1 block text-sm font-semibold">Keterangan</label><textarea value={form.data.keterangan} onChange={(e) => form.setData('keterangan', e.target.value)} rows="3" className={input} /></div>
                <div className="flex gap-2 md:col-span-2"><button className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">Simpan</button><Link href={route('nomor-surat.index')} className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold">Batal</Link></div>
            </form>
        </AdminLayout>
    );
}
