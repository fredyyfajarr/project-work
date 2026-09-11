import { Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import PageHeader from '../../../Components/PageHeader';
import DataTable from '../../../Components/DataTable';
import Badge from '../../../Components/Badge';
import { route } from '../../../lib/route';

export default function Detail({ m = null, mahasiswa = null }) {
    const mhs = m || mahasiswa || {};
    const kel = mhs.keluarga || {};
    const riwayat = Array.isArray(mhs.akademik) ? mhs.akademik : [];
    const beasiswaList = Array.isArray(mhs.beasiswa) ? mhs.beasiswa : [];
    const tracer = mhs.tracerTerbaru || null;

    const rows = [
        ['NIM', mhs.nim],
        ['Nama Lengkap', mhs.nama],
        ['Program Studi', mhs.jurusan],
        ['Angkatan', mhs.angkatan],
        ['Jenis Perkuliahan', mhs.jenisReguler || 'Reguler A'],
        ['Disabilitas', mhs.disabilitas || mhs.jenisHambatan],
        ['Level Hambatan', mhs.levelHambatan],
        ['Jalur Masuk', mhs.jalurMasuk],
        ['NIK KTP', mhs.nik],
        ['No HP', mhs.noHp],
        ['Email', mhs.email],
        ['Alamat', mhs.alamat],
    ];

    const keluargaRows = [
        ['Nama Ayah', kel.namaAyah],
        ['Pekerjaan Ayah', kel.pekerjaanAyah],
        ['No HP Ayah', kel.noHpAyah],
        ['Nama Ibu', kel.namaIbu],
        ['Pekerjaan Ibu', kel.pekerjaanIbu],
        ['No HP Ibu', kel.noHpIbu],
    ];

    return (
        <AdminLayout title="Detail Mahasiswa">
            <PageHeader
                title={mhs.nama || 'Detail Mahasiswa'}
                subtitle={`NIM: ${mhs.nim || '-'} • ${mhs.jurusan || '-'}`}
                actions={[
                    { label: 'Cetak Biodata (PDF)', href: `/admin/mahasiswa/${mhs.idMahasiswa}/cetak-biodata`, icon: 'bi-printer-fill', variant: 'success', external: true },
                    { label: 'Edit', href: route('mahasiswa.edit', mhs.idMahasiswa), icon: 'bi-pencil' },
                    { label: 'Kembali', href: route('mahasiswa.index'), variant: 'secondary', icon: 'bi-arrow-left' },
                ]}
            />

            <div className="space-y-6">
                {/* Header Profil */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white shadow-md">
                            {String(mhs.nama || '?').slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{mhs.nama || '-'}</h3>
                            <div className="text-xs text-slate-500 mt-0.5">
                                NIM: <span className="font-semibold text-slate-700">{mhs.nim}</span> • {mhs.jurusan}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge status={mhs.status || '-'} />
                                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2563eb]">
                                    {mhs.jenisReguler || 'Reguler A'}
                                </span>
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                    {mhs.disabilitas || 'Disabilitas'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link href={route('akademik.show', mhs.idMahasiswa)} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-semibold text-[#2563eb] hover:bg-blue-100 transition">
                            <i className="bi bi-mortarboard" />
                            <span>Lihat Akademik</span>
                        </Link>
                        <Link href={route('monitoring.detail', mhs.idMahasiswa)} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition">
                            <i className="bi bi-graph-up" />
                            <span>Monitoring</span>
                        </Link>
                    </div>
                </div>

                {/* Data Grid Utama & Berkas */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Informasi Pribadi & Kontak</h4>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {rows.map(([l, v]) => (
                                <div key={l} className="flex justify-between rounded-xl bg-slate-50/80 px-3.5 py-2 text-xs border border-slate-100">
                                    <span className="text-slate-500">{l}</span>
                                    <span className="font-semibold text-slate-800 text-right">{v || '-'}</span>
                                </div>
                            ))}
                        </div>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-6 mb-4">Data Orang Tua / Keluarga</h4>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {keluargaRows.map(([l, v]) => (
                                <div key={l} className="flex justify-between rounded-xl bg-slate-50/80 px-3.5 py-2 text-xs border border-slate-100">
                                    <span className="text-slate-500">{l}</span>
                                    <span className="font-semibold text-slate-800 text-right">{v || '-'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kolom Berkas Identitas */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Berkas Identitas & Dokumen</h4>
                        <div className="space-y-3">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div className="text-xs font-semibold text-slate-700">Kartu Tanda Penduduk (KTP)</div>
                                {mhs.fileKtp ? (
                                    <a href={`/storage/${mhs.fileKtp}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline">
                                        <i className="bi bi-file-earmark-pdf text-base" /> Unduh / Lihat KTP
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400 mt-1 block">Belum diunggah</span>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div className="text-xs font-semibold text-slate-700">Kartu Keluarga (KK)</div>
                                {mhs.fileKk ? (
                                    <a href={`/storage/${mhs.fileKk}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline">
                                        <i className="bi bi-file-earmark-pdf text-base" /> Unduh / Lihat KK
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400 mt-1 block">Belum diunggah</span>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div className="text-xs font-semibold text-slate-700">Surat Keterangan Kerja (Reguler C)</div>
                                {mhs.fileSuratKerja ? (
                                    <a href={`/storage/${mhs.fileSuratKerja}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline">
                                        <i className="bi bi-file-earmark-pdf text-base" /> Unduh / Lihat Berkas Kerja
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400 mt-1 block">Tidak ada / Belum diunggah</span>
                                )}
                            </div>

                            {tracer && (
                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                                    <div className="text-xs font-bold text-emerald-900">Status Tracer Study Alumni</div>
                                    <div className="text-xs font-semibold text-emerald-700 mt-1">{tracer.statusPekerjaan}</div>
                                    {tracer.namaInstansi && <div className="text-[11px] text-slate-600 mt-0.5">{tracer.namaInstansi} ({tracer.jabatan})</div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Riwayat Akademik */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Riwayat Akademik Per Semester</h4>
                    <DataTable
                        searchable={false}
                        perPage={10}
                        data={riwayat}
                        columns={[
                            { key: 'semester', label: 'Semester', render: (r) => `Semester ${r?.semester ?? '-'}` },
                            { key: 'ips', label: 'IPS', render: (r) => r?.ips ?? '-' },
                            { key: 'ipk', label: 'IPK', render: (r) => r?.ipk ?? '-' },
                        ]}
                        emptyTitle="Belum ada riwayat akademik"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}