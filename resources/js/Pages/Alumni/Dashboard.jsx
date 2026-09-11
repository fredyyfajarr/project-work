import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Badge from '../../Components/Badge';

export default function Dashboard({ mahasiswa = {}, tracer = null, stats = {} }) {
    const m = mahasiswa || {};

    return (
        <AdminLayout title="Portal Alumni LLD">
            {/* Banner Selamat Datang */}
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg md:p-8 mb-6 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                        Portal Navigasi Alumni Disabilitas
                    </span>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                        Selamat Datang, {m?.nama || 'Alumni'}!
                    </h2>
                    <p className="mt-2 text-sm text-blue-100">
                        Terima kasih telah menjadi bagian dari alumni Universitas Pamulang. Mari bantu adik tingkat dan lembaga dengan memperbarui data Tracer Study Anda secara berkala.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/alumni/tracer-study"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
                        >
                            <i className="bi bi-briefcase-fill text-sm" />
                            <span>{stats.hasFilledTracer ? 'Perbarui Tracer Study' : 'Isi Tracer Study Sekarang'}</span>
                        </Link>
                        <Link
                            href="/alumni/aspirasi"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-500/30 border border-white/20 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500/40"
                        >
                            <i className="bi bi-chat-left-text-fill text-sm" />
                            <span>Kirim Masukan / Aspirasi</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistik & Ringkasan */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Status Pekerjaan</span>
                        <Badge status={tracer?.statusPekerjaan ? 'Disetujui' : 'Belum Mengisi'} />
                    </div>
                    <div className="mt-3 text-lg font-bold text-slate-800">{stats.statusPekerjaan}</div>
                    <p className="mt-1 text-xs text-slate-500">{tracer?.namaInstansi ? `Instansi: ${tracer.namaInstansi}` : 'Belum mengisi data pekerjaan'}</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500">Program Studi & Angkatan</div>
                    <div className="mt-3 text-lg font-bold text-slate-800">{m?.jurusan || '-'}</div>
                    <p className="mt-1 text-xs text-slate-500">Angkatan {m?.angkatan || '-'} • NIM: {m?.nim}</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500">Aspirasi Terkirim</div>
                    <div className="mt-3 text-lg font-bold text-slate-800">{stats.aspirasiCount} Aspirasi</div>
                    <p className="mt-1 text-xs text-slate-500">Saluran aspirasi alumni aktif</p>
                </div>
            </div>

            {/* Pengumuman Layanan Alumni */}
            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800">Layanan & Informasi Alumni Disabilitas</h3>
                <p className="text-xs text-slate-500 mt-0.5">Informasi terkini kegiatan kerja sama dan dukungan karier bagi alumni penyandang disabilitas.</p>

                <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-700">
                        <div className="font-bold text-blue-900 flex items-center gap-2">
                            <i className="bi bi-info-circle-fill text-blue-600" />
                            Penyaluran Informasi Lowongan Kerja Inklusif
                        </div>
                        <p className="mt-1 text-slate-600">
                            LLD Universitas Pamulang bekerja sama dengan berbagai mitra industri untuk menyediakan peluang kerja inklusif bagi lulusan disabilitas. Pastikan nomor kontak dan email Anda selalu aktif di halaman profil.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}