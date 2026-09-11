# KONTEKS PROJECT WORK — PORTAL NADI LLD UNPAM

Dokumen referensi utama arsitektur, konvensi, dan status terkini Sistem Informasi Lembaga Layanan Disabilitas (LLD) Universitas Pamulang.

---

## 1. Identitas & Latar Belakang Project
- **Judul Project Work**: Pengembangan Portal NADI (Navigasi Akademik dan Dukungan Inklusif) Berbasis Web pada Lembaga Layanan Disabilitas Universitas Pamulang.
- **Tim Pengembang**: Salsa Sayida Bilqis, Atika Widayanti, Fredy Fajar Adi Putra (Teknik Informatika, Universitas Pamulang 2026).
- **Mitra**: Lembaga Layanan Disabilitas (LLD) Universitas Pamulang (Kampus Viktor & Kampus Serang).
- **Tujuan Pengembangan**: Mengembangkan portal terintegrasi yang menggabungkan Company Profile Inklusif, Sistem Informasi Akademik Mandiri Mahasiswa Disabilitas, Portal Alumni & Tracer Study, serta Monitoring & Layanan Terpusat bagi Pengelola LLD.

---

## 2. Struktur Direktori Kerja (Windows)
- `C:\project\PROJECT_WORK` $\leftarrow$ **Direktori Utama & Aktif** (Modern Stack: Laravel 13 + Inertia + React).
- `C:\project\PROJECT_WORK_BEFORE` $\leftarrow$ Arsip backup kode legacy (Laravel 10 + Blade, referensi data awal).

---

## 3. Tech Stack & Arsitektur Sistem
- **Backend Framework**: **Laravel 13.31 (PHP ^8.3)**.
- **Frontend Stack**: **Inertia.js 3 + React 18 + Tailwind CSS v4 + Vite 7**.
- **Basis Data**: **MySQL** database `lld_project_work` (127.0.0.1:3306).
- **Otentikasi & Otorisasi**: Laravel Session Auth + **Spatie Laravel Permission (6 Roles)**.
- **Aksesibilitas & UI**:
  - Universal Accessibility Widget 100% (Text-to-Speech Web Speech API Bahasa Indonesia, font disleksia, filter kontras tinggi/invert, kursor besar, spasi teks, pintasan Alt+A).
  - Dual Theme System: *Light Academic* (`#EEF5FB`) & *Dark Midnight* (`#050D24`) dengan transisi *smooth bottom fade*.
  - Responsive Mobile-First dengan drawer hamburger dan collapsible desktop sidebar.
- **Library Pendukung**:
  - Dokumen & Cetak: `barryvdh/laravel-dompdf` (Cetak Biodata Mahasiswa & Laporan PDF).
  - Pengolahan Spreadsheet: `maatwebsite/excel ^4` (Import Mahasiswa/Akademik/Luaran & Ekspor CSV).
  - Routing Frontend: `tightenco/ziggy` via helper wrapper `resources/js/lib/route.js`.

---

## 4. Pembagian Peran Pengguna (6 Roles)
1. **`admin` (Administrator)**: Hak akses penuh sistem, pengelolaan pengguna, ACC permohonan reset password, CMS, nomor surat, data master mahasiswa, akademik, laporan, dan monitoring.
2. **`ketua` (Kepala Lembaga)**: Monitoring perkembangan akademik mahasiswa, kepatuhan jadwal, monitoring aspirasi, data alumni, dan laporan rekapitulasi.
3. **`staff` (Kepala Bidang Viktor)**: Pengelolaan dan verifikasi beasiswa internal, validasi luaran & prestasi, monitoring kepatuhan jadwal, dan monitoring akademik kampus Viktor.
4. **`staff_serang` (Kepala Bidang Serang)**: Monitoring akademik mahasiswa kampus Serang, validasi luaran, monitoring jadwal, dan aspirasi.
5. **`mahasiswa` (Mahasiswa Disabilitas)**: Dashboard akademik pribadi, CRUD nilai & KHS mandiri, unggah jadwal kuliah, pengajuan luaran bukti, pengajuan beasiswa, penyampaian aspirasi, dan ganti sandi mandiri.
6. **`alumni` (Alumni Disabilitas)**: Pengisian kuesioner Tracer Study 13 parameter, pembaruan profil karir, pengiriman aspirasi alumni, dan ganti sandi mandiri.

---

## 5. Konvensi & Prinsip Arsitektur (Clean Architecture)
1. **Prinsip Skema Database Legacy**:
   - Tabel akun = **`user` (singular)** dengan primary key **`idUser`** tanpa timestamps default.
   - Tabel profil mahasiswa = **`mahasiswa`** dengan primary key **`idMahasiswa`**.
   - Model `User` meng-extend `Authenticatable` dan menggunakan trait `HasRoles`.
   - Event `booted()` pada model `User` menjamin sinkronisasi otomatis ke tabel `model_has_roles` setiap kali record disimpan.
2. **Backend sebagai Sumber Kebenaran**:
   - Controller dirancang tipis (*skinny controllers*), mengembalikan `Inertia::render`.
   - Validasi data input 100% menggunakan FormRequest khusus di `app/Http/Requests/` dengan pesan error Bahasa Indonesia.
   - Logika bisnis terisolasi pada Service Layer di `app/Services/` (`DisabilitasService`, `StatistikService`, `StudentAccountService`, `CmsContentService`, `LaporanService`, `ImportService`).
3. **Keamanan Rute (RBAC Enforced)**:
   - Rute `/mahasiswa/*` dilindungi middleware `'role:mahasiswa'`.
   - Rute `/alumni/*` dilindungi middleware `'role:alumni'`.
   - Rute `/admin/*` dilindungi middleware Spatie sesuai hak akses peran (HTTP 403 Forbidden bila dilanggar).
   - Pengunduhan berkas dilindungi validasi kepemilikan anti-IDOR (`FileController::jadwal`).

---

## 6. Status Verifikasi & Kesiapan Rilis
- **Automated Tests**: `php artisan test` $\rightarrow$ **14 passed (33 assertions), 100% PASS**.
- **Frontend Build**: `npm run build` $\rightarrow$ **715 modules transformed**, build sukses ~3 detik.
- **Database Migrations**: Seluruh migrasi aktif dan konsisten (`php artisan migrate:status`).
- **Alur Forgot Password**: Teruji end-to-end dengan verifikasi ACC Admin dan token kriptografi.
- **Cetak Dokumen**: Cetak Biodata Mahasiswa PDF (KAK 8.1.1.g) dan Laporan PDF aktif via DomPDF.
