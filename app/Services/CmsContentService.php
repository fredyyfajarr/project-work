<?php

namespace App\Services;

use App\Models\Cms;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Throwable;

class CmsContentService
{
    public const SECTIONS = [
        'berita-acara' => ['kategori' => 'luaran', 'nama_menu' => 'Berita Acara', 'default_judul' => 'Berita Acara LLD UNPAM', 'default_deskripsi' => 'Dokumentasi kegiatan, informasi, dan berita acara Lembaga Layanan Disabilitas Universitas Pamulang.', 'default_gambar' => 'assets/implementasi1.jpg', 'allow_link' => true, 'urutan' => 1],
        'implementasi-kerja-sama' => ['kategori' => 'luaran', 'nama_menu' => 'Implementasi Kerja Sama', 'default_judul' => 'Implementasi Kerja Sama', 'default_deskripsi' => 'Universitas Pamulang melalui LLD menjalin kerja sama dengan berbagai institusi dalam penguatan layanan disabilitas yang inklusif.', 'default_gambar' => 'assets/implementasi1.jpg', 'allow_link' => false, 'urutan' => 2],
        'pelatihan-juru-bahasa-isyarat' => ['kategori' => 'luaran', 'nama_menu' => 'Pelatihan Juru Bahasa Isyarat', 'default_judul' => 'Pelatihan Juru Bahasa Isyarat', 'default_deskripsi' => 'Pelatihan Juru Bahasa Isyarat untuk volunteer pendamping mahasiswa Tuli.', 'default_gambar' => 'assets/pelatihan1.jpg', 'allow_link' => false, 'urutan' => 3],
        'kalender-akademik' => ['kategori' => 'layanan', 'nama_menu' => 'Kalender Akademik', 'default_judul' => 'Semester Genap 2025/2026', 'default_deskripsi' => 'Kalender akademik layanan mahasiswa disabilitas Universitas Pamulang.', 'default_gambar' => 'assets/kalenderakademik.png', 'allow_link' => false, 'urutan' => 4],
        'sosialisasi-inklusi-kampus' => ['kategori' => 'program', 'nama_menu' => 'Sosialisasi Inklusi Kampus', 'default_judul' => 'Sosialisasi Inklusi Kampus', 'default_deskripsi' => 'Program edukasi dan penguatan budaya kampus inklusif Universitas Pamulang.', 'default_gambar' => 'assets/dummy.jpg', 'allow_link' => false, 'urutan' => 5],
        'setara-pmbd' => ['kategori' => 'program', 'nama_menu' => 'SETARA PMBD', 'default_judul' => 'SETARA PMBD', 'default_deskripsi' => 'Program pendampingan dan penguatan akses pendidikan bagi mahasiswa penyandang disabilitas.', 'default_gambar' => 'assets/dummy.jpg', 'allow_link' => false, 'urutan' => 6],
        'adik-beasiswa-yayasan' => ['kategori' => 'program', 'nama_menu' => 'ADIK dan Beasiswa Yayasan', 'default_judul' => 'ADIK dan Beasiswa Yayasan', 'default_deskripsi' => 'Dukungan biaya pendidikan bagi mahasiswa disabilitas.', 'default_gambar' => 'assets/dummy.jpg', 'allow_link' => false, 'urutan' => 7],
        'pelita-disabilitas' => ['kategori' => 'program', 'nama_menu' => 'PELITA Disabilitas', 'default_judul' => 'PELITA Disabilitas', 'default_deskripsi' => 'Program pengembangan literasi, talenta, dan aktivitas mahasiswa disabilitas.', 'default_gambar' => 'assets/dummy.jpg', 'allow_link' => false, 'urutan' => 8],
        'link' => ['kategori' => 'program', 'nama_menu' => 'LINK', 'default_judul' => 'LINK', 'default_deskripsi' => 'Program kolaborasi dan konektivitas kampus inklusif.', 'default_gambar' => 'assets/dummy.jpg', 'allow_link' => false, 'urutan' => 9],
    ];

    public function definitions(): array
    {
        return self::SECTIONS;
    }

    public function definition(string $menuSlug): ?array
    {
        return self::SECTIONS[$menuSlug] ?? null;
    }

    public function ensureDefaults(): void
    {
        if (! $this->tableReady()) {
            return;
        }

        foreach (self::SECTIONS as $menuSlug => $section) {
            if (! Cms::where('menu_slug', $menuSlug)->exists()) {
                Cms::create([
                    'slug' => $menuSlug.'-1', 'menu_slug' => $menuSlug, 'kategori' => $section['kategori'],
                    'nama_menu' => $section['nama_menu'], 'judul' => $section['default_judul'],
                    'deskripsi' => $section['default_deskripsi'], 'gambar' => $section['default_gambar'],
                    'link_berita' => null, 'urutan' => 1, 'status' => 'aktif', 'tanggalUpdate' => now(),
                ]);
            }
        }
    }

    public function items(string $menuSlug, bool $onlyActive = true)
    {
        $definition = $this->definition($menuSlug);

        if (! $definition) {
            return collect();
        }

        if (! $this->tableReady()) {
            return collect([$this->fallbackItem($menuSlug, $definition)]);
        }

        try {
            $query = Cms::where('menu_slug', $menuSlug)->orderBy('urutan')->orderByDesc('idCms');
            if ($onlyActive) {
                $query->where('status', 'aktif');
            }
            $rows = $query->get();
        } catch (Throwable) {
            return collect();
        }

        return $rows->isEmpty() && $onlyActive ? collect([$this->fallbackItem($menuSlug, $definition)]) : $rows;
    }

    public function firstItem(string $menuSlug): array
    {
        $first = $this->items($menuSlug)->first();

        return $first instanceof Cms ? $first->toArray() : (is_array($first) ? $first : []);
    }

    public function sectionsByCategory(string $category): array
    {
        $sections = array_filter(self::SECTIONS, fn ($s) => $s['kategori'] === $category);
        uasort($sections, fn ($a, $b) => ($a['urutan'] ?? 0) <=> ($b['urutan'] ?? 0));

        return $sections;
    }

    public function tableReady(): bool
    {
        try {
            return Schema::hasTable('cms') && Schema::hasColumn('cms', 'slug') && Schema::hasColumn('cms', 'menu_slug') && Schema::hasColumn('cms', 'gambar');
        } catch (Throwable) {
            return false;
        }
    }

    public function makeUniqueSlug(string $menuSlug, string $judul, ?int $ignoreId = null): string
    {
        $base = Str::slug($menuSlug.'-'.$judul) ?: $menuSlug.'-'.time();
        $slug = $base;
        $counter = 2;

        while (Cms::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('idCms', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }

    private function fallbackItem(string $menuSlug, array $definition): array
    {
        return array_merge($definition, [
            'idCms' => 0, 'slug' => $menuSlug.'-1', 'menu_slug' => $menuSlug,
            'judul' => $definition['default_judul'], 'deskripsi' => $definition['default_deskripsi'],
            'gambar' => $definition['default_gambar'], 'link_berita' => null, 'status' => 'aktif',
        ]);
    }
}
