import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';

export default function Beasiswa({ beasiswa, mahasiswa = {} }) {
    const m = mahasiswa || {};
    const b = beasiswa || null;

    const form = useForm({
        nikKtp: b?.nikKtp || m?.nik || '',
        namaBank: b?.namaBank || '',
        noRekening: b?.noRekening || '',
        atasNama: b?.atasNama || m?.nama || '',
        jenisBeasiswa: b?.jenisBeasiswa || 'Beasiswa Disabilitas',
        periode: b?.periode || new Date().getFullYear().toString(),
        fileBukuTabungan: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/mahasiswa/beasiswa', {
            forceFormData: true,
        });
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100';

    return (
        <AdminLayout title="Kelola Beasiswa & Rekening">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Informasi Status Beasiswa */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800">Status Pengajuan Beasiswa</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Informasi verifikasi nomor rekening & pencairan beasiswa LLD.
                        </p>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                                <div className="text-xs text-slate-500 font-medium">Status Verifikasi</div>
                                <div className="mt-1.5 flex items-center justify-between">
                                    <Badge status={b?.status || 'Belum Mengajukan'} />
                                    <span className="text-xs text-slate-400">
                                        {b?.updated_at ? new Date(b.updated_at).toLocaleDateString('id-ID') : '-'}
                                    </span>
                                </div>
                            </div>

                            {b?.catatan && (
                                <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-amber-900 text-xs">
                                    <span className="font-semibold block mb-1">Catatan Verifikator:</span>
                                    {b.catatan}
                                </div>
                            )}

                            <div className="space-y-2 text-xs text-slate-600">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400">Nama Mahasiswa</span>
                                    <span className="font-semibold text-slate-700">{m?.nama}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400">NIM</span>
                                    <span className="font-semibold text-slate-700">{m?.nim}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400">Program Studi</span>
                                    <span className="font-semibold text-slate-700">{m?.jurusan}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400">Disabilitas</span>
                                    <span className="font-semibold text-slate-700">{m?.disabilitas}</span>
                                </div>
                            </div>

                            {b?.fileBukuTabungan && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <a
                                        href={`/storage/${b.fileBukuTabungan}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563eb] hover:underline"
                                    >
                                        <i className="bi bi-file-earmark-pdf text-base" />
                                        Lihat Scan Buku Tabungan
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Kelola Beasiswa & Rekening */}
                <div className="lg:col-span-2">
                    <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Formulir Rekening & Data Beasiswa</h3>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Pastikan nomor rekening masih aktif dan atas nama mahasiswa sendiri.
                                </p>
                            </div>
                            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                                Periode {b?.periode || new Date().getFullYear()}
                            </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-semibold text-slate-700">NIK (KTP)</label>
                                <input
                                    type="text"
                                    value={form.data.nikKtp}
                                    onChange={(e) => form.setData('nikKtp', e.target.value)}
                                    placeholder="16 digit NIK KTP"
                                    className={`mt-1.5 ${inputClass}`}
                                />
                                {form.errors.nikKtp && <p className="mt-1 text-xs text-rose-500">{form.errors.nikKtp}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">Jenis Beasiswa</label>
                                <input
                                    type="text"
                                    value={form.data.jenisBeasiswa}
                                    onChange={(e) => form.setData('jenisBeasiswa', e.target.value)}
                                    placeholder="Contoh: Beasiswa Disabilitas UNPAM"
                                    className={`mt-1.5 ${inputClass}`}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">
                                    Nama Bank <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={form.data.namaBank}
                                    onChange={(e) => form.setData('namaBank', e.target.value)}
                                    required
                                    className={`mt-1.5 ${inputClass}`}
                                >
                                    <option value="">Pilih Bank</option>
                                    <option value="Bank BCA">Bank BCA</option>
                                    <option value="Bank Mandiri">Bank Mandiri</option>
                                    <option value="Bank BNI">Bank BNI</option>
                                    <option value="Bank BRI">Bank BRI</option>
                                    <option value="Bank BSI">Bank Syariah Indonesia (BSI)</option>
                                    <option value="Bank Banten">Bank Banten</option>
                                    <option value="Bank DKI">Bank DKI</option>
                                    <option value="Bank Lainnya">Bank Lainnya</option>
                                </select>
                                {form.errors.namaBank && <p className="mt-1 text-xs text-rose-500">{form.errors.namaBank}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">
                                    Nomor Rekening <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.data.noRekening}
                                    onChange={(e) => form.setData('noRekening', e.target.value)}
                                    placeholder="Nomor rekening bank"
                                    required
                                    className={`mt-1.5 ${inputClass}`}
                                />
                                {form.errors.noRekening && <p className="mt-1 text-xs text-rose-500">{form.errors.noRekening}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-700">
                                    Nama Pemilik Rekening (Sesuai Buku Tabungan) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.data.atasNama}
                                    onChange={(e) => form.setData('atasNama', e.target.value)}
                                    placeholder="Nama pemilik rekening"
                                    required
                                    className={`mt-1.5 ${inputClass}`}
                                />
                                {form.errors.atasNama && <p className="mt-1 text-xs text-rose-500">{form.errors.atasNama}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-700">
                                    Unggah Scan Halaman Depan Buku Tabungan / E-Statement
                                </label>
                                <p className="text-[11px] text-slate-500 mb-1.5">
                                    Format file: PDF, JPG, PNG (Maksimal 5MB). Harus memperlihatkan nomor rekening dan nama pemilik dengan jelas.
                                </p>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => form.setData('fileBukuTabungan', e.target.files[0])}
                                    className={`mt-1 ${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#2563eb] hover:file:bg-blue-100`}
                                />
                                {form.errors.fileBukuTabungan && <p className="mt-1 text-xs text-rose-500">{form.errors.fileBukuTabungan}</p>}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                            >
                                <i className="bi bi-send-fill" />
                                <span>{form.processing ? 'Menyimpan...' : 'Simpan & Kirim Verifikasi'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}