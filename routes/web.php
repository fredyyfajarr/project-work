<?php

use App\Http\Controllers\AkademikController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AspirasiMonitoringController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeasiswaController;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\JadwalMonitoringController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\LuaranController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\MahasiswaDashboardController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\NomorSuratController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatistikController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| WEBSITE PUBLIK / COMPANY PROFILE
|--------------------------------------------------------------------------
*/

Route::get('/', [PageController::class, 'home'])->name('home');
Route::redirect('/index.php', '/');

Route::prefix('tentang')->name('tentang.')->group(function () {
    Route::get('/sejarah', [PageController::class, 'sejarah'])->name('sejarah');
    Route::get('/sambutan', [PageController::class, 'sambutan'])->name('sambutan');
    Route::get('/visi-misi', [PageController::class, 'visiMisi'])->name('visi-misi');
    Route::get('/struktur', [PageController::class, 'struktur'])->name('struktur');
});

Route::prefix('luaran')->name('luaran.')->group(function () {
    Route::get('/berita', [PageController::class, 'berita'])->name('berita');
    Route::get('/kerjasama', [PageController::class, 'kerjasama'])->name('kerjasama');
    Route::get('/pelatihan', [PageController::class, 'pelatihan'])->name('pelatihan');
});

Route::prefix('layanan')->name('layanan.')->group(function () {
    Route::get('/pmb', [PageController::class, 'pmb'])->name('pmb');
    Route::get('/volunteer', [PageController::class, 'volunteer'])->name('volunteer');
    Route::get('/kalender', [PageController::class, 'kalender'])->name('kalender');
});

Route::prefix('program')->name('program.')->group(function () {
    Route::get('/', [PageController::class, 'program'])->name('index');
    Route::get('/inklusi', [PageController::class, 'inklusi'])->name('inklusi');
    Route::get('/setara', [PageController::class, 'setara'])->name('setara');
    Route::get('/beasiswa', [PageController::class, 'beasiswa'])->name('beasiswa');
    Route::get('/pelita', [PageController::class, 'pelita'])->name('pelita');
    Route::get('/link', [PageController::class, 'link'])->name('link');
});

Route::get('/kontak', [PageController::class, 'kontak'])->name('kontak');
Route::post('/kontak', [PageController::class, 'kirimKontak'])->name('kontak.kirim');
Route::get('/statistik', [StatistikController::class, 'index'])->name('statistik.index');
Route::get('/statistik/data', [StatistikController::class, 'data'])->name('statistik.data');
Route::get('/search', [SearchController::class, 'index'])->name('search');

/* Redirect URL lama project PHP Native agar tidak 404. */
Route::redirect('/view/sejarah.php', '/tentang/sejarah');
Route::redirect('/view/sambutan.php', '/tentang/sambutan');
Route::redirect('/view/visi-misi.php', '/tentang/visi-misi');
Route::redirect('/view/struktur.php', '/tentang/struktur');
Route::redirect('/view/berita.php', '/luaran/berita');
Route::redirect('/view/kerjasama.php', '/luaran/kerjasama');
Route::redirect('/view/pelatihan.php', '/luaran/pelatihan');
Route::redirect('/view/pmb.php', '/layanan/pmb');
Route::redirect('/view/volunteer.php', '/layanan/volunteer');
Route::redirect('/view/kalender.php', '/layanan/kalender');
Route::redirect('/view/program.php', '/program');
Route::redirect('/view/inklusi.php', '/program/inklusi');
Route::redirect('/view/setara.php', '/program/setara');
Route::redirect('/view/beasiswa.php', '/program/beasiswa');
Route::redirect('/view/pelita.php', '/program/pelita');
Route::redirect('/view/link.php', '/program/link');
Route::redirect('/view/kontak.php', '/kontak');

/*
|--------------------------------------------------------------------------
| AUTH (Laravel Auth::attempt + session, Breeze-style)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1')->name('login.process');
    Route::get('/forgot-password', [AuthController::class, 'forgotForm'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'forgotSend'])->middleware('throttle:5,1')->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'resetForm'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetStore'])->name('password.store');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

/*
|--------------------------------------------------------------------------
| AREA TEROTENTIKASI (middleware auth bawaan Laravel)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('/dashboard', '/mahasiswa');
    Route::get('/file/jadwal/{id}', [FileController::class, 'jadwal'])->name('file.jadwal');

    /*
    |--------------------------------------------------------------------------
    | PORTAL MAHASISWA (Khusus role: mahasiswa)
    |--------------------------------------------------------------------------
    */
    Route::prefix('mahasiswa')->name('mahasiswa.')->middleware('role:mahasiswa')->group(function () {
        Route::get('/', [MahasiswaDashboardController::class, 'dashboard'])->name('dashboard');
        Route::get('/profil', [MahasiswaDashboardController::class, 'profil'])->name('profil');
        Route::post('/profil', [MahasiswaDashboardController::class, 'updateProfil'])->name('profil.update');
        Route::post('/ganti-password', [MahasiswaDashboardController::class, 'updatePassword'])->name('password.update');
        Route::get('/akademik', [MahasiswaDashboardController::class, 'akademik'])->name('akademik');
        Route::post('/akademik', [MahasiswaDashboardController::class, 'storeAkademik'])->name('akademik.store');
        Route::put('/akademik/{id}', [MahasiswaDashboardController::class, 'updateAkademik'])->name('akademik.update');
        Route::delete('/akademik/{id}', [MahasiswaDashboardController::class, 'deleteAkademik'])->name('akademik.delete');
        Route::get('/luaran', [MahasiswaDashboardController::class, 'luaran'])->name('luaran');
        Route::post('/luaran', [MahasiswaDashboardController::class, 'storeLuaran'])->name('luaran.store');
        Route::get('/jadwal', [MahasiswaDashboardController::class, 'jadwal'])->name('jadwal');
        Route::post('/jadwal', [MahasiswaDashboardController::class, 'storeJadwal'])->name('jadwal.store');
        Route::put('/jadwal/{id}', [MahasiswaDashboardController::class, 'updateJadwal'])->name('jadwal.update');
        Route::delete('/jadwal/{id}', [MahasiswaDashboardController::class, 'deleteJadwal'])->name('jadwal.delete');
        Route::get('/aspirasi', [MahasiswaDashboardController::class, 'aspirasi'])->name('aspirasi');
        Route::post('/aspirasi', [MahasiswaDashboardController::class, 'storeAspirasi'])->name('aspirasi.store');
        Route::get('/beasiswa', [BeasiswaController::class, 'mahasiswaIndex'])->name('beasiswa');
        Route::post('/beasiswa', [BeasiswaController::class, 'mahasiswaStore'])->name('beasiswa.store');
    });

    /*
    |--------------------------------------------------------------------------
    | PORTAL ALUMNI (Khusus role: alumni)
    |--------------------------------------------------------------------------
    */
    Route::prefix('alumni')->name('alumni.')->middleware('role:alumni')->group(function () {
        Route::get('/', [AlumniController::class, 'dashboard'])->name('dashboard');
        Route::get('/tracer-study', [AlumniController::class, 'tracerStudy'])->name('tracer');
        Route::post('/tracer-study', [AlumniController::class, 'storeTracerStudy'])->name('tracer.store');
        Route::get('/profil', [AlumniController::class, 'profil'])->name('profil');
        Route::post('/profil', [AlumniController::class, 'updateProfil'])->name('profil.update');
        Route::get('/aspirasi', [AlumniController::class, 'aspirasi'])->name('aspirasi');
        Route::post('/aspirasi', [AlumniController::class, 'storeAspirasi'])->name('aspirasi.store');
    });

    /*
    |--------------------------------------------------------------------------
    | AREA MANAJEMEN & ADMIN (Terproteksi RBAC Spatie)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin|ketua|staff|staff_serang')->group(function () {
        Route::get('/admin', [DashboardController::class, 'index'])->name('dashboard');

        Route::prefix('admin')->name('admin.')->group(function () {
            // Modul Bersama: Mahasiswa, Alumni, Monitoring, Jadwal, Aspirasi, Laporan
            Route::prefix('mahasiswa')->name('mahasiswa.')->group(function () {
                Route::get('/', [MahasiswaController::class, 'index'])->name('index');
                Route::get('/create', [MahasiswaController::class, 'create'])->name('create');
                Route::post('/', [MahasiswaController::class, 'store'])->name('store');
                Route::post('/preview', [MahasiswaController::class, 'preview'])->name('preview');
                Route::post('/import', [MahasiswaController::class, 'import'])->name('import');
                Route::post('/cancel-preview', [MahasiswaController::class, 'cancelPreview'])->name('cancel');
                Route::get('/{id}', [MahasiswaController::class, 'detail'])->name('show');
                Route::get('/{id}/cetak-biodata', [MahasiswaController::class, 'cetakBiodata'])->name('cetak');
                Route::get('/{id}/edit', [MahasiswaController::class, 'edit'])->name('edit');
                Route::put('/{id}', [MahasiswaController::class, 'update'])->name('update');
                Route::delete('/{id}', [MahasiswaController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('alumni')->name('alumni.')->group(function () {
                Route::get('/', [AlumniController::class, 'adminIndex'])->name('index');
                Route::get('/export', [AlumniController::class, 'exportTracer'])->name('export');
            });

            Route::prefix('monitoring')->name('monitoring.')->group(function () {
                Route::get('/', [MonitoringController::class, 'index'])->name('index');
                Route::get('/lulus', [MonitoringController::class, 'lulus'])->name('lulus');
                Route::get('/terlambat', [MonitoringController::class, 'terlambat'])->name('terlambat');
                Route::get('/bermasalah', [MonitoringController::class, 'bermasalah'])->name('bermasalah');
                Route::get('/status/{status}', [MonitoringController::class, 'status'])->name('status');
                Route::get('/{id}', [MonitoringController::class, 'monitoringDetail'])->name('show');
            });

            Route::get('/monitoring-jadwal', [JadwalMonitoringController::class, 'index'])->name('monitoring.jadwal');
            Route::get('/monitoring-aspirasi', [AspirasiMonitoringController::class, 'index'])->name('monitoring.aspirasi');
            Route::post('/monitoring-aspirasi/{id}/tanggapi', [AspirasiMonitoringController::class, 'updateStatus'])->name('monitoring.aspirasi.tanggapi');

            Route::prefix('laporan')->name('laporan.')->group(function () {
                Route::get('/', [LaporanController::class, 'index'])->name('index');
                Route::post('/', [LaporanController::class, 'index'])->name('generate');
                Route::get('/export', [LaporanController::class, 'export'])->name('export');
            });

            Route::post('/ganti-password', [UserController::class, 'updateMyPassword'])->name('ganti-password');

            // Khusus Admin & Staff Viktor: Beasiswa
            Route::prefix('beasiswa')->name('beasiswa.')->middleware('role:admin|staff')->group(function () {
                Route::get('/', [BeasiswaController::class, 'adminIndex'])->name('index');
                Route::post('/verifikasi/{id}', [BeasiswaController::class, 'verifikasi'])->name('verifikasi');
                Route::get('/export', [BeasiswaController::class, 'export'])->name('export');
            });

            // Khusus Admin, Staff Viktor, Staff Serang: Validasi Luaran
            Route::prefix('luaran')->name('luaran.')->middleware('role:admin|staff|staff_serang')->group(function () {
                Route::get('/', [LuaranController::class, 'index'])->name('index');
                Route::post('/', [LuaranController::class, 'store'])->name('store');
                Route::post('/preview', [LuaranController::class, 'preview'])->name('preview');
                Route::post('/import', [LuaranController::class, 'importProcess'])->name('import');
                Route::post('/validasi/{id}/{status}', [LuaranController::class, 'validasi'])->name('validasi');
                Route::put('/{id}', [LuaranController::class, 'update'])->name('update');
                Route::delete('/{id}', [LuaranController::class, 'destroy'])->name('destroy');
            });

            // Khusus Administrator: Pengelolaan Pengguna, CMS, Nomor Surat, Permohonan Reset & Kelola Akademik
            Route::middleware('role:admin')->group(function () {
                Route::prefix('akademik')->name('akademik.')->group(function () {
                    Route::get('/', [AkademikController::class, 'index'])->name('index');
                    Route::post('/', [AkademikController::class, 'store'])->name('store');
                    Route::post('/preview', [AkademikController::class, 'preview'])->name('preview');
                    Route::post('/import', [AkademikController::class, 'importExcel'])->name('import');
                    Route::get('/{id}', [AkademikController::class, 'show'])->name('show');
                    Route::put('/{id}', [AkademikController::class, 'update'])->name('update');
                    Route::delete('/{id}', [AkademikController::class, 'destroy'])->name('destroy');
                });

                Route::prefix('cms')->name('cms.')->group(function () {
                    Route::get('/', [CmsController::class, 'index'])->name('index');
                    Route::post('/', [CmsController::class, 'store'])->name('store');
                    Route::put('/{id}', [CmsController::class, 'update'])->name('update');
                    Route::delete('/{id}', [CmsController::class, 'destroy'])->name('destroy');
                });

                Route::prefix('nomor-surat')->name('nomor-surat.')->group(function () {
                    Route::get('/', [NomorSuratController::class, 'index'])->name('index');
                    Route::get('/create', [NomorSuratController::class, 'create'])->name('create');
                    Route::post('/', [NomorSuratController::class, 'store'])->name('store');
                });

                Route::prefix('user')->name('user.')->group(function () {
                    Route::get('/', [UserController::class, 'index'])->name('index');
                    Route::get('/create', [UserController::class, 'create'])->name('create');
                    Route::post('/', [UserController::class, 'store'])->name('store');
                    Route::post('/sync-mahasiswa', [UserController::class, 'syncMahasiswa'])->name('sync');
                    Route::get('/{id}/edit', [UserController::class, 'edit'])->name('edit');
                    Route::put('/{id}', [UserController::class, 'update'])->name('update');
                    Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
                    Route::post('/{id}/reset', [UserController::class, 'reset'])->name('reset');
                });

                Route::prefix('permohonan-reset')->name('permohonan-reset.')->group(function () {
                    Route::get('/', [UserController::class, 'resetRequests'])->name('index');
                    Route::post('/{id}/approve', [UserController::class, 'approveResetRequest'])->name('approve');
                    Route::post('/{id}/reject', [UserController::class, 'rejectResetRequest'])->name('reject');
                });
            });
        });
    });
});
