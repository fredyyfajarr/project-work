<?php

namespace Database\Seeders;

use App\Models\Cms;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    /**
     * 9 menu CMS dari data lama (satu baris per menu_slug unik).
     * Diambil dari lld_project_work.sql tabel `cms` (id 2-10).
     */
    public function run(): void
    {
        $rows = [
            [
                'slug' => 'implementasi-kerja-sama-implementasi-kerja-sama',
                'menu_slug' => 'implementasi-kerja-sama',
                'kategori' => 'luaran',
                'nama_menu' => 'Implementasi Kerja Sama',
                'judul' => 'Implementasi Kerja Sama',
                'deskripsi' => 'Universitas Pamulang melalui LLD menjalin kerja sama dan studi banding dengan berbagai institusi dalam penguatan layanan disabilitas yang inklusif.',
                'gambar' => 'assets/implementasi1.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'pelatihan-juru-bahasa-isyarat-pelatihan-juru-bahasa-isyarat',
                'menu_slug' => 'pelatihan-juru-bahasa-isyarat',
                'kategori' => 'luaran',
                'nama_menu' => 'Pelatihan Juru Bahasa Isyarat',
                'judul' => 'Pelatihan Juru Bahasa Isyarat',
                'deskripsi' => 'Pelatihan Juru Bahasa Isyarat diberikan kepada volunteer untuk mendukung komunikasi mahasiswa Tuli dalam kegiatan akademik.',
                'gambar' => 'assets/pelatihan1.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'kalender-akademik-semester-genap-2025-2026',
                'menu_slug' => 'kalender-akademik',
                'kategori' => 'layanan',
                'nama_menu' => 'Kalender Akademik',
                'judul' => 'Semester Genap 2025/2026',
                'deskripsi' => 'Kalender akademik layanan mahasiswa disabilitas Universitas Pamulang.',
                'gambar' => 'assets/kalenderakademik.png',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'sosialisasi-inklusi-kampus-sosialisasi-inklusi-kampus',
                'menu_slug' => 'sosialisasi-inklusi-kampus',
                'kategori' => 'program',
                'nama_menu' => 'Sosialisasi Inklusi Kampus',
                'judul' => 'Sosialisasi Inklusi Kampus',
                'deskripsi' => 'Program edukasi dan penguatan budaya kampus inklusif bagi seluruh civitas akademika Universitas Pamulang.',
                'gambar' => 'assets/dummy.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'setara-pmbd-setara-pmbd',
                'menu_slug' => 'setara-pmbd',
                'kategori' => 'program',
                'nama_menu' => 'SETARA PMBD',
                'judul' => 'SETARA PMBD',
                'deskripsi' => 'Program pendampingan dan penguatan akses pendidikan bagi mahasiswa penyandang disabilitas di Universitas Pamulang.',
                'gambar' => 'assets/dummy.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'adik-beasiswa-yayasan-adik-dan-beasiswa-yayasan',
                'menu_slug' => 'adik-beasiswa-yayasan',
                'kategori' => 'program',
                'nama_menu' => 'ADIK dan Beasiswa Yayasan',
                'judul' => 'ADIK dan Beasiswa Yayasan',
                'deskripsi' => 'Dukungan pendidikan inklusif melalui program bantuan biaya pendidikan bagi mahasiswa disabilitas.',
                'gambar' => 'assets/dummy.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'pelita-disabilitas-pelita-disabilitas',
                'menu_slug' => 'pelita-disabilitas',
                'kategori' => 'program',
                'nama_menu' => 'PELITA Disabilitas',
                'judul' => 'PELITA Disabilitas',
                'deskripsi' => 'Program pengembangan literasi, talenta, dan aktivitas mahasiswa disabilitas di lingkungan Universitas Pamulang.',
                'gambar' => 'assets/dummy.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'link-link',
                'menu_slug' => 'link',
                'kategori' => 'program',
                'nama_menu' => 'LINK',
                'judul' => 'LINK',
                'deskripsi' => 'Program kolaborasi, konektivitas, dan lingkungan kampus yang inklusif bagi mahasiswa disabilitas.',
                'gambar' => 'assets/dummy.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
            [
                'slug' => 'berita-acara-1',
                'menu_slug' => 'berita-acara',
                'kategori' => 'luaran',
                'nama_menu' => 'Berita Acara',
                'judul' => 'Berita Acara LLD UNPAM',
                'deskripsi' => 'Dokumentasi kegiatan, informasi, dan berita acara Lembaga Layanan Disabilitas Universitas Pamulang.',
                'gambar' => 'assets/implementasi1.jpg',
                'link_berita' => null,
                'urutan' => 1,
                'status' => 'aktif',
            ],
        ];

        foreach ($rows as $row) {
            Cms::updateOrCreate(['slug' => $row['slug']], $row);
        }
    }
}
