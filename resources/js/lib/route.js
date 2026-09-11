// Helper route() — fallback ke pattern route dinamis agar semua named route Laravel
// menghasilkan URL yang 100% presisi (termasuk /{id}/edit, /{id}/reset, dsb).

const ROUTE_PATTERNS = {
    // Auth & Public
    home: '/',
    'tentang.sejarah': '/tentang/sejarah',
    'tentang.sambutan': '/tentang/sambutan',
    'tentang.visi-misi': '/tentang/visi-misi',
    'tentang.struktur': '/tentang/struktur',
    'luaran.berita': '/luaran/berita',
    'luaran.kerjasama': '/luaran/kerjasama',
    'luaran.pelatihan': '/luaran/pelatihan',
    'layanan.pmb': '/layanan/pmb',
    'layanan.volunteer': '/layanan/volunteer',
    'layanan.kalender': '/layanan/kalender',
    'program.index': '/program',
    'program.inklusi': '/program/inklusi',
    'program.setara': '/program/setara',
    'program.beasiswa': '/program/beasiswa',
    'program.pelita': '/program/pelita',
    'program.link': '/program/link',
    kontak: '/kontak',
    'kontak.kirim': '/kontak',
    'statistik.index': '/statistik',
    'statistik.data': '/statistik/data',
    search: '/search',
    login: '/login',
    'login.process': '/login',
    logout: '/logout',
    'forgot.password': '/forgot-password',
    'password.request': '/forgot-password',
    'password.email': '/forgot-password',
    'password.reset': '/reset-password/:token',
    'password.store': '/reset-password',

    // Dashboard
    dashboard: '/admin',
    'admin.dashboard': '/admin',

    // Admin Mahasiswa
    'mahasiswa.index': '/admin/mahasiswa',
    'admin.mahasiswa.index': '/admin/mahasiswa',
    'mahasiswa.create': '/admin/mahasiswa/create',
    'admin.mahasiswa.create': '/admin/mahasiswa/create',
    'mahasiswa.store': '/admin/mahasiswa',
    'admin.mahasiswa.store': '/admin/mahasiswa',
    'mahasiswa.preview': '/admin/mahasiswa/preview',
    'admin.mahasiswa.preview': '/admin/mahasiswa/preview',
    'mahasiswa.import': '/admin/mahasiswa/import',
    'admin.mahasiswa.import': '/admin/mahasiswa/import',
    'mahasiswa.cancel': '/admin/mahasiswa/cancel-preview',
    'admin.mahasiswa.cancel': '/admin/mahasiswa/cancel-preview',
    'mahasiswa.show': '/admin/mahasiswa/:id',
    'mahasiswa.detail': '/admin/mahasiswa/:id',
    'admin.mahasiswa.show': '/admin/mahasiswa/:id',
    'mahasiswa.edit': '/admin/mahasiswa/:id/edit',
    'admin.mahasiswa.edit': '/admin/mahasiswa/:id/edit',
    'mahasiswa.update': '/admin/mahasiswa/:id',
    'admin.mahasiswa.update': '/admin/mahasiswa/:id',
    'mahasiswa.destroy': '/admin/mahasiswa/:id',
    'admin.mahasiswa.destroy': '/admin/mahasiswa/:id',

    // Admin Akademik
    'akademik.index': '/admin/akademik',
    'admin.akademik.index': '/admin/akademik',
    'akademik.store': '/admin/akademik',
    'admin.akademik.store': '/admin/akademik',
    'akademik.preview': '/admin/akademik/preview',
    'admin.akademik.preview': '/admin/akademik/preview',
    'akademik.import': '/admin/akademik/import',
    'admin.akademik.import': '/admin/akademik/import',
    'akademik.show': '/admin/akademik/:id',
    'admin.akademik.show': '/admin/akademik/:id',
    'akademik.update': '/admin/akademik/:id',
    'admin.akademik.update': '/admin/akademik/:id',
    'akademik.destroy': '/admin/akademik/:id',
    'admin.akademik.destroy': '/admin/akademik/:id',

    // Admin Beasiswa & Alumni
    'beasiswa.index': '/admin/beasiswa',
    'admin.beasiswa.index': '/admin/beasiswa',
    'admin.beasiswa.export': '/admin/beasiswa/export',
    'admin.beasiswa.verifikasi': '/admin/beasiswa/verifikasi/:id',
    'alumni.index': '/admin/alumni',
    'admin.alumni.index': '/admin/alumni',
    'admin.alumni.export': '/admin/alumni/export',

    // Admin Monitoring
    monitoring: '/admin/monitoring',
    'monitoring.index': '/admin/monitoring',
    'admin.monitoring.index': '/admin/monitoring',
    'monitoring.show': '/admin/monitoring/:id',
    'monitoring.detail': '/admin/monitoring/:id',
    'admin.monitoring.show': '/admin/monitoring/:id',
    'monitoring.jadwal': '/admin/monitoring-jadwal',
    'admin.monitoring.jadwal': '/admin/monitoring-jadwal',
    'monitoring.aspirasi': '/admin/monitoring-aspirasi',
    'admin.monitoring.aspirasi': '/admin/monitoring-aspirasi',
    'admin.monitoring.lulus': '/admin/monitoring/lulus',
    'admin.monitoring.terlambat': '/admin/monitoring/terlambat',
    'admin.monitoring.bermasalah': '/admin/monitoring/bermasalah',
    'admin.monitoring.status': '/admin/monitoring/status/:status',

    // Admin Laporan
    'laporan.index': '/admin/laporan',
    'admin.laporan.index': '/admin/laporan',
    'laporan.generate': '/admin/laporan',
    'admin.laporan.generate': '/admin/laporan',
    'laporan.export': '/admin/laporan/export',
    'admin.laporan.export': '/admin/laporan/export',

    // Admin Luaran
    'luaran.index': '/admin/luaran',
    'admin.luaran.index': '/admin/luaran',
    'luaran.store': '/admin/luaran',
    'admin.luaran.store': '/admin/luaran',
    'luaran.preview': '/admin/luaran/preview',
    'admin.luaran.preview': '/admin/luaran/preview',
    'luaran.import': '/admin/luaran/import',
    'admin.luaran.import': '/admin/luaran/import',
    'luaran.update': '/admin/luaran/:id',
    'admin.luaran.update': '/admin/luaran/:id',
    'luaran.destroy': '/admin/luaran/:id',
    'admin.luaran.destroy': '/admin/luaran/:id',
    'luaran.validasi': '/admin/luaran/validasi/:id/:status',
    'admin.luaran.validasi': '/admin/luaran/validasi/:id/:status',

    // Admin CMS
    'cms.index': '/admin/cms',
    'admin.cms.index': '/admin/cms',
    'cms.store': '/admin/cms',
    'admin.cms.store': '/admin/cms',
    'cms.update': '/admin/cms/:id',
    'admin.cms.update': '/admin/cms/:id',
    'cms.destroy': '/admin/cms/:id',
    'admin.cms.destroy': '/admin/cms/:id',

    // Admin Nomor Surat
    'nomor-surat.index': '/admin/nomor-surat',
    'admin.nomor-surat.index': '/admin/nomor-surat',
    'nomor-surat.create': '/admin/nomor-surat/create',
    'admin.nomor-surat.create': '/admin/nomor-surat/create',
    'nomor-surat.store': '/admin/nomor-surat',
    'admin.nomor-surat.store': '/admin/nomor-surat',

    // Admin User
    'user.index': '/admin/user',
    'admin.user.index': '/admin/user',
    'user.create': '/admin/user/create',
    'admin.user.create': '/admin/user/create',
    'user.store': '/admin/user',
    'admin.user.store': '/admin/user',
    'user.edit': '/admin/user/:id/edit',
    'admin.user.edit': '/admin/user/:id/edit',
    'user.update': '/admin/user/:id',
    'admin.user.update': '/admin/user/:id',
    'user.destroy': '/admin/user/:id',
    'admin.user.destroy': '/admin/user/:id',
    'user.reset': '/admin/user/:id/reset',
    'admin.user.reset': '/admin/user/:id/reset',
    'user.sync': '/admin/user/sync-mahasiswa',
    'admin.user.sync': '/admin/user/sync-mahasiswa',

    // Permohonan Reset Password (Admin)
    'admin.permohonan-reset.index': '/admin/permohonan-reset',
    'admin.permohonan-reset.approve': '/admin/permohonan-reset/:id/approve',
    'admin.permohonan-reset.reject': '/admin/permohonan-reset/:id/reject',
    'admin.ganti-password': '/admin/ganti-password',
    'mahasiswa.password.update': '/mahasiswa/ganti-password',

    // Mahasiswa Portal
    'file.jadwal': '/file/jadwal/:id',
    'mahasiswa.dashboard': '/mahasiswa',
    'mahasiswa.profil': '/mahasiswa/profil',
    'mahasiswa.profil.update': '/mahasiswa/profil',
    'mahasiswa.akademik': '/mahasiswa/akademik',
    'mahasiswa.akademik.store': '/mahasiswa/akademik',
    'mahasiswa.akademik.update': '/mahasiswa/akademik/:id',
    'mahasiswa.akademik.delete': '/mahasiswa/akademik/:id',
    'mahasiswa.luaran': '/mahasiswa/luaran',
    'mahasiswa.luaran.store': '/mahasiswa/luaran',
    'mahasiswa.jadwal': '/mahasiswa/jadwal',
    'mahasiswa.jadwal.store': '/mahasiswa/jadwal',
    'mahasiswa.jadwal.update': '/mahasiswa/jadwal/:id',
    'mahasiswa.jadwal.delete': '/mahasiswa/jadwal/:id',
    'mahasiswa.aspirasi': '/mahasiswa/aspirasi',
    'mahasiswa.aspirasi.store': '/mahasiswa/aspirasi',
    'mahasiswa.beasiswa': '/mahasiswa/beasiswa',
    'mahasiswa.beasiswa.store': '/mahasiswa/beasiswa',

    // Alumni Portal
    'alumni.dashboard': '/alumni',
    'alumni.tracer': '/alumni/tracer-study',
    'alumni.tracer.store': '/alumni/tracer-study',
    'alumni.profil': '/alumni/profil',
    'alumni.profil.update': '/alumni/profil',
    'alumni.aspirasi': '/alumni/aspirasi',
    'alumni.aspirasi.store': '/alumni/aspirasi',
};

export function route(name, param, extraParam) {
    try {
        if (typeof window !== 'undefined' && typeof window.route === 'function') {
            return window.route(name, param);
        }
    } catch (e) {
        // fallback ke ROUTE_PATTERNS
    }

    const pattern = ROUTE_PATTERNS[name];
    if (!pattern) {
        return `/${String(name).replace(/\./g, '/')}`;
    }

    let url = pattern;

    if (param !== undefined && param !== null && param !== '') {
        if (typeof param === 'object') {
            Object.keys(param).forEach((k) => {
                url = url.replace(`:${k}`, encodeURIComponent(param[k]));
            });
            const idVal = param.id || param.idMahasiswa || param.idUser || param.idBeasiswa || param.idLuaran || param.idCms;
            if (idVal !== undefined) {
                url = url.replace(':id', encodeURIComponent(idVal));
            }
        } else {
            if (url.includes(':id')) {
                url = url.replace(':id', encodeURIComponent(param));
            } else if (url.includes(':status')) {
                url = url.replace(':status', encodeURIComponent(param));
            } else if (url.includes(':token')) {
                url = url.replace(':token', encodeURIComponent(param));
            } else {
                url = `${url}/${encodeURIComponent(param)}`;
            }
        }
    }

    if (extraParam !== undefined && extraParam !== null && extraParam !== '') {
        if (url.includes(':status')) {
            url = url.replace(':status', encodeURIComponent(extraParam));
        } else {
            url = `${url}/${encodeURIComponent(extraParam)}`;
        }
    }

    return url;
}

export default route;
