# Catatan Migrasi & Evolusi Sistem — Portal NADI LLD UNPAM

Dokumentasi historis dan teknis proses migrasi dari versi Kerja Praktik terdahulu (Laravel 10 + Blade) menuju versi Pengembangan Project Work (Laravel 13 + Inertia.js + React + Tailwind CSS v4).

---

## 1. Transformasi Arsitektur

| Aspek | Versi Lama (Kerja Praktik) | Versi Baru (Project Work - Portal NADI) |
| :--- | :--- | :--- |
| **Tech Stack** | Laravel 10 + Blade Templating + Custom CSS / Bootstrap | **Laravel 13.31 + Inertia.js 3 + React 18 + Tailwind CSS v4 + Vite 7** |
| **Arsitektur Kode** | Monolitik Blade, controller gemuk, query database langsung di template | **Clean Architecture**: Controller tipis, FormRequest Bahasa Indonesia, Dedicated Services Layer |
| **Otentikasi** | Session manual (`session(['user' => ...])`), tanpa hash reset aman | **Laravel Auth resmi + Spatie Permission (6 roles)**, session regenerate, secure POST logout |
| **Aktor Sistem** | 2 Aktor terbatas (Admin & Mahasiswa) | **6 Aktor Lengkap**: Administrator, Kepala Lembaga (Ketua), Kabid Viktor, Kabid Serang, Mahasiswa, Alumni |
| **Portal Mahasiswa** | Read-only profil dasar | Self-service lengkap: KHS/Nilai, Jadwal, Luaran, Beasiswa, Aspirasi, Profil |
| **Portal Alumni** | Belum ada | Portal Alumni mandiri + Kuesioner Tracer Study 13 parameter & Aspirasi |
| **Aksesibilitas** | Tidak ada fitur disabilitas khusus | **Universal Accessibility Widget 100%**: TTS, Disleksia, Mode Kontras, Kursor, Spasi, Alt+A |
| **Desain Visual** | Satu tema terang statis | **Dual Theme System**: Light Academic (`#EEF5FB`) & Dark Midnight (`#050D24`) |

---

## 2. Basis Data & Penyesuaian Skema
- **Sumber Skema Data Awal**: `PROJECT_WORK_BEFORE/lld_project_work.sql` (18 tabel legacy).
- **Tabel Kunci yang Dipertahankan**:
  - Tabel akun pengguna tetap menggunakan nama singular **`user`** dengan primary key **`idUser`** tanpa kolom timestamps default, menjaga kompatibilitas penuh dengan data riil kampus.
  - Tabel mahasiswa tetap menggunakan primary key **`idMahasiswa`**.
- **Migrasi Tambahan yang Diterapkan**:
  1. `create_permission_tables.php` (Tabel bawaan Spatie: `roles`, `permissions`, `model_has_roles`, dll.)
  2. `create_password_reset_requests_table.php` (Mendukung alur lupa password berbasis tiket persetujuan ACC Admin)
  3. `add_tanggapan_to_aspirasi_table.php` (Mendukung mandat KAK 8.1.2.b: kolom `tanggapan` admin pada aspirasi mahasiswa & alumni)
- **Sinkronisasi Data Awal**:
  - `RoleSeeder` mendaftarkan 6 role: `admin`, `ketua`, `staff`, `staff_serang`, `mahasiswa`, `alumni`.
  - `LegacyDataSeeder` menyinkronkan 84 data akun awal ke Spatie `model_has_roles`.
  - Hook `booted()` pada model `User` secara otomatis mengaitkan role baru/update ke Spatie.

---

## 3. Keamanan & Penguatan Rute (Security Hardening)
- **Role-Based Access Control (RBAC)**:
  - Middleware Spatie `'role'` diterapkan langsung pada level rute di `routes/web.php`.
  - Akses ilegal melalui pengetikan URL langsung (misal: mahasiswa membuka `/admin/*` atau admin membuka `/mahasiswa/*`) langsung diblokir dengan status **HTTP 403 Forbidden**.
- **Perlindungan Dokumen Anti-IDOR**:
  - Method `FileController::jadwal` memverifikasi kepemilikan berkas: mahasiswa hanya diizinkan mengunduh file jadwal miliknya sendiri.
- **Validasi Berkas & Upload**:
  - Batasan MIME type ketat (`pdf,jpg,jpeg,png,webp`) dan ukuran maksimum 2MB - 5MB pada seluruh FormRequest.
- **Rate Limiting**:
  - Login dibatasi 6 kali/menit (`throttle:6,1`).
  - Permohonan reset password dibatasi 5 kali/menit (`throttle:5,1`).

---

## 4. Pemenuhan Kerangka Acuan Kerja (KAK)
- **KAK 8.1.1.g (Cetak Lembar Biodata Resmi Mahasiswa PDF)**:
  - Fitur ekspor PDF A4 resmi langsung dari halaman detail mahasiswa, memuat data diri, ragam disabilitas, keluarga/kontak darurat, riwayat nilai akademik, dan pengesahan LLD.
- **KAK 8.1.2.a (Monitoring Kepatuhan Jadwal Mahasiswa)**:
  - Dashboard monitoring jadwal kini dilengkapi tab pemisah antara jadwal yang sudah terunggah dengan daftar mahasiswa aktif yang belum mengunggah, dilengkapi indikator persentase kepatuhan dan tombol kontak WhatsApp langsung.
- **KAK 8.1.2.b (Monitoring & Tindak Lanjut Aspirasi)**:
  - Administrator dan staf LLD dapat memberikan tanggapan resmi dan mengubah status aspirasi (`Diajukan`, `Diproses`, `Selesai`, `Ditolak`). Tanggapan ditampilkan secara transparan pada portal mahasiswa dan alumni.

---

## 5. Ringkasan Verifikasi Sistem
- **Automated Tests**: 14 Feature Tests (33 assertions) $\rightarrow$ **100% PASS** via `php artisan test`.
- **Frontend Build**: 715 modul terkompilasi bersih via `npm run build` dalam ~3.4 detik.
