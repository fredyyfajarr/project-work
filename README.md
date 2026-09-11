# LLD UNPAM — PROJECT_WORK (Laravel 13 + Inertia + React)

Rebuild clean-architecture dari `PROJECT_WORK_BEFORE` (Laravel 10 + Blade).
Seluruh fitur lama dipertahankan, UI/UX disamakan, frontend diganti React.

## Stack
- Laravel 13.31 (PHP ^8.3) + Inertia 3 + React 18 + Tailwind v4 + Vite 7
- MySQL `lld_project_work` (lihat `.env`)
- Auth bawaan Laravel (session) + spatie/laravel-permission (6 roles: admin, ketua, staff, staff_serang, mahasiswa, alumni)
- Excel (maatwebsite/excel 4), PDF (barryvdh/laravel-dompdf), Ziggy routes di React
- Universal Accessibility Widget (TTS, Disleksia, High Contrast, Font Scaling, Alt+A)
- Dual Theme System (Light Academic & Dark Midnight)

## Fitur Utama
1. **Portal Mahasiswa**: Dashboard IPK/IPS, KHS & Rangkuman Nilai, Upload Jadwal Perkuliahan, Luaran & Prestasi, Pengajuan Beasiswa, dan Aspirasi Mahasiswa.
2. **Portal Alumni**: Dashboard Alumni, Kuesioner Tracer Study 13 parameter, Riwayat & Statistik Karir, Aspirasi Alumni.
3. **Manajemen & Monitoring LLD**: Monitoring Akademik, Monitoring Jadwal & Kepatuhan (KAK 8.1.2.a), Monitoring & Tanggapan Aspirasi (KAK 8.1.2.b), Cetak Biodata Resmi PDF (KAK 8.1.1.g), Verifikasi Beasiswa & Luaran, Rekapitulasi Laporan (PDF & Excel).
4. **Security & Akun**: RBAC Spatie multi-level (HTTP 403 route protection), Alur Lupa Password berbasis Approval ACC Admin, Ganti Password Mandiri Global (bcrypt), Proteksi IDOR dokumen & Rate Limiting.

## Cara jalan (Windows + dbngin/TablePlus)
1. Pastikan MySQL jalan dan database `lld_project_work` ada (import `PROJECT_WORK_BEFORE/lld_project_work.sql` bila kosong).
2. Sesuaikan `.env`: `DB_HOST/DB_PORT/DB_DATABASE/DB_USERNAME/DB_PASSWORD`, `APP_URL=http://127.0.0.1:8000`.
3. `composer install`
4. `php artisan migrate --seed` (fresh: `migrate:fresh --seed`)
5. `php artisan storage:link`
6. `npm install` lalu 2 terminal: `php artisan serve` + `npm run dev`. Produksi: `npm run build`.

## Akun (data asli sudah diimport: 84 users, 80 mahasiswa, 11 CMS)
- Password akun lama tetap berlaku (hash bcrypt bawaan).
- Demo cepat: `php artisan db:seed --class=DemoUserSeeder` untuk akun `admin/password123` dkk (menimpa password admin legacy — hanya untuk demo).
- Default flow `migrate:fresh --seed` = RoleSeeder + LegacyDataSeeder (data asli + 84 role assignments).

## Verifikasi & Kualitas Kode
- `php artisan migrate:status` — Seluruh migrasi Ran
- `npm run build` — 715 modules transformed, built ~3s
- `php artisan test` — 14 passed (33 assertions), 100% PASS

Lihat juga: `DOKUMENTASI_SISTEM.md`, `MIGRATION_NOTES.md`, `FEATURE_CHECKLIST.md`.
