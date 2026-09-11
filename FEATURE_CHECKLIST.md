# Feature Checklist — Sistem Informasi LLD UNPAM (Portal NADI)

Dokumen pelacakan fitur dan hasil evolusi dari versi lama (Laravel 10 Blade) menuju versi aktif Project Work (Laravel 13 + Inertia + React + Tailwind v4). Diselaraskan dengan Kerangka Acuan Kerja (KAK) Project Work "Portal NADI" Universitas Pamulang.

---

## 1. Portal Publik (`Public/*`)
- [x] Home `/` + Statistik interaktif realtime (jumlah mahasiswa disabilitas, jurusan, ragam hambatan)
- [x] Tentang Lembaga: Sejarah, Sambutan Kepala Lembaga, Visi-Misi, Struktur Organisasi
- [x] Luaran & Kegiatan: Berita & Artikel, Kerjasama/Kemitraan, Pelatihan & Workshop (CMS-driven)
- [x] Layanan Inklusif: Penerimaan Mahasiswa Baru (PMB), Relawan (Volunteer), Kalender Akademik (CMS-driven)
- [x] Program Unggulan: Program Inklusi, Program SETARA, Program Beasiswa, Program PELITA, Program LINK (CMS-driven)
- [x] Kontak LLD (Form kirim pesan interaktif + informasi kontak kampus Pamulang & Serang)
- [x] Pencarian Global (`/search`) & Statistik Data (`/statistik`)
- [x] Universal Accessibility Widget (TTS, Disleksia, Mode Kontras, Kursor Besar, Spasi Teks, Dual Theme, Alt+A)
- [x] Rute kompatibilitas redirect legacy PHP Native (`/view/*.php`)

---

## 2. Autentikasi & Manajemen Akun (`Auth/*`)
- [x] Login resmi Laravel Auth + session regenerate + proteksi CSRF
- [x] Rate limiting login (`throttle:6,1`) dan lupa password (`throttle:5,1`)
- [x] Alur Lupa Password berbasis Approval ACC Admin:
  - Validasi username/NIM & email terdaftar
  - Antrean permohonan masuk ke dashboard Administrator
  - Admin menyetujui (ACC) dan menerbitkan token aman 64 karakter (hash bcrypt, masa berlaku 24 jam, single-use)
  - Pengguna melakukan reset kata sandi mandiri via token
- [x] Modal Ganti Password Mandiri Global (tersedia di header dashboard seluruh aktor)
- [x] Logout aman via metode `POST` berproteksi token CSRF

---

## 3. Portal Mahasiswa Self-Service (`Mahasiswa/*`)
- [x] Dashboard Mahasiswa (Ringkasan IPK, IPS terakhir, status akademik, pengumuman, pintasan layanan)
- [x] Pengelolaan Profil Mandiri (pembaruan email, no. WhatsApp, alamat domisili, foto profil, dan ganti password)
- [x] Kelola Nilai & KHS Mandiri (CRUD nilai per semester, kalkulasi IPK/IPS, pencegahan input semester ganda)
- [x] Kelola Jadwal Perkuliahan (Unggah jadwal PDF/gambar per semester, preview, unduh terproteksi IDOR)
- [x] Kelola Luaran & Prestasi (Unggah bukti sertifikat/foto, status validasi pending/diterima/ditolak)
- [x] Pengajuan Beasiswa (Input data rekening bank, upload cover buku tabungan, pantau status verifikasi)
- [x] Kelola Aspirasi Mahasiswa (Kirim keluhan/masukan, pantau status Diajukan/Diproses/Selesai/Ditolak, dan lihat tanggapan resmi dari pihak LLD)

---

## 4. Portal Alumni & Tracer Study (`Alumni/*`)
- [x] Dashboard Alumni (Statistik karir, ringkasan pengisian tracer, info kegiatan alumni disabilitas)
- [x] Kuesioner Tracer Study Mandiri (13 parameter penelusuran: status kerja, nama instansi, keselarasan bidang ilmu, pendapatan, waktu tunggu kerja, dll.)
- [x] Riwayat Pengisian & Pembaruan Data Tracer Study
- [x] Profil Alumni (Pembaruan kontak terkini, domisili, foto profil)
- [x] Kelola Aspirasi Alumni (Penyampaian masukan alumni, rekomendasi peluang kerja, dan pemantauan tanggapan LLD)

---

## 5. Area Manajemen LLD & Admin (`Admin/*`)
- [x] Dashboard Monitoring Terpusat (`/admin`: metrik mahasiswa, sebaran disabilitas, grafik kelulusan, log aktivitas)
- [x] Pengelolaan Data Mahasiswa Disabilitas (CRUD lengkap, detail komprehensif, preview & import massal Excel, pembatalan preview, manajemen kontak keluarga/wali, auto-generate akun pengguna)
- [x] **Cetak Lembar Biodata Mahasiswa PDF (KAK 8.1.1.g)** (Cetak resmi kop LLD UNPAM via DomPDF, identitas, ragam disabilitas, keluarga, dan riwayat akademik)
- [x] Pengelolaan Data Alumni & Tracer Study (Tabel respon tracer, filter jurusan/status kerja, ekspor data CSV)
- [x] Monitoring Akademik (Monitoring status: Mahasiswa Aktif, Lulus, Terlambat $\ge$ Semester 8, Bermasalah IPK $<$ 2.75)
- [x] **Monitoring Jadwal & Kepatuhan Mahasiswa (KAK 8.1.2.a)** (Tab file terunggah, tab daftar mahasiswa belum unggah jadwal, metrik % kepatuhan, dan tombol kontak langsung WhatsApp)
- [x] **Monitoring & Tindak Lanjut Aspirasi (KAK 8.1.2.b)** (Tabel aspirasi mahasiswa & alumni, modal berikan tanggapan resmi LLD, dan pembaruan status: Diajukan, Diproses, Selesai, Ditolak)
- [x] Verifikasi Beasiswa (Verifikasi berkas rekening & buku tabungan oleh Admin/Kabid Viktor, catatan revisi, ekspor CSV)
- [x] Validasi Luaran & Prestasi (Verifikasi bukti sertifikat mahasiswa oleh Admin/Staff, preview/import massal Excel)
- [x] Kelola Laporan Terpusat (5 jenis laporan: Mahasiswa, Akademik, Monitoring, Luaran, Nomor Surat via CSV Stream & PDF)
- [x] Pengelolaan CMS (Kelola konten dinamis berita, kerjasama, pelatihan, program, dan kalender)
- [x] Manajemen Nomor Surat (Penerbitan format nomor surat otomatis bebas race condition)
- [x] Pengelolaan Pengguna (CRUD akun, filter role, reset password manual)
- [x] Verifikasi Permohonan Reset Password (ACC permohonan lupa password, penolakan tiket, penerbitan tautan reset)

---

## 6. Keamanan & Kualitas Kode (Security & Code Quality)
- [x] Role-Based Access Control (RBAC) Spatie multi-level:
  - Proteksi middleware pada level rute di `routes/web.php` (HTTP 403 Forbidden bila akses tidak sah)
  - Auto-synchronization peran ke tabel `model_has_roles` via hook `booted()` model `User.php`
- [x] Proteksi IDOR pada unduhan berkas jadwal perkuliahan (`FileController::jadwal`)
- [x] Validasi ekstensi MIME dan batas ukuran file ketat (2MB - 5MB) pada seluruh FormRequest
- [x] Clean Architecture: Controllers tipis, FormRequests Bahasa Indonesia, Dedicated Services Layer
- [x] Automated Test Suite: 14 feature test cases (33 assertions) — 100% PASS
- [x] Kompilasi Frontend Vite: 715 modules transformed tanpa error
