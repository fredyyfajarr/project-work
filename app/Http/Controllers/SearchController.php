<?php

namespace App\Http\Controllers;

use App\Services\CmsContentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /** [judul, deskripsi, kategori, nama route, keywords] */
    private const PAGES = [
        ['Beranda LLD UNPAM', 'Halaman utama LLD UNPAM: statistik, berita acara, dan informasi umum.', 'Company Profile', 'home', 'home beranda statistik berita acara lembaga layanan disabilitas universitas pamulang lld unpam'],
        ['Sejarah LLD', 'Sejarah dan latar belakang LLD Universitas Pamulang.', 'Tentang', 'tentang.sejarah', 'sejarah lld lembaga layanan disabilitas tentang unpam'],
        ['Sambutan Kepala LLD', 'Sambutan Kepala Lembaga Layanan Disabilitas Universitas Pamulang.', 'Tentang', 'tentang.sambutan', 'sambutan kepala lembaga layanan disabilitas'],
        ['Visi & Misi LLD', 'Visi dan misi Lembaga Layanan Disabilitas Universitas Pamulang.', 'Tentang', 'tentang.visi-misi', 'visi misi tujuan lld unpam'],
        ['Struktur Organisasi', 'Struktur organisasi Lembaga Layanan Disabilitas Universitas Pamulang.', 'Tentang', 'tentang.struktur', 'struktur organisasi lld unpam'],
        ['PMB Mahasiswa Disabilitas', 'Layanan penerimaan mahasiswa baru bagi mahasiswa disabilitas.', 'Layanan', 'layanan.pmb', 'pmb penerimaan mahasiswa baru disabilitas layanan'],
        ['Volunteer LLD', 'Layanan dan kegiatan volunteer LLD UNPAM.', 'Layanan', 'layanan.volunteer', 'volunteer relawan layanan pendamping mahasiswa disabilitas'],
        ['Kalender Akademik', 'Kalender akademik semester dan tahun ajaran.', 'Layanan', 'layanan.kalender', 'kalender akademik semester tahun ajaran layanan'],
        ['Program Kerja', 'Program kerja LLD: Inklusi Kampus, SETARA PMBD, ADIK & Beasiswa, PELITA, LINK.', 'Program', 'program.index', 'program kerja sosialisasi inklusi kampus setara pmbd adik beasiswa yayasan pelita disabilitas link'],
        ['Kontak Kami', 'Alamat kampus, Linktree, dan form kontak LLD UNPAM.', 'Kontak', 'kontak', 'kontak alamat linktree kampus pusat viktor witana harja serang'],
        ['Statistik Lengkap', 'Statistik layanan mahasiswa disabilitas LLD UNPAM.', 'Statistik', 'statistik.index', 'statistik mahasiswa aktif lulusan program kerja jenis disabilitas ipk ips'],
    ];

    public function __construct(private readonly CmsContentService $cms)
    {
    }

    public function index(Request $request): Response
    {
        $query = trim((string) $request->query('q', ''));
        $results = $query === '' ? [] : $this->search($query);

        return Inertia::render('Public/Search', [
            'pageTitle' => $query ? 'Hasil Pencarian: '.$query.' — LLD UNPAM' : 'Pencarian — LLD UNPAM',
            'query' => $query,
            'results' => $results,
        ]);
    }

    private function search(string $query): array
    {
        $results = array_merge($this->searchStaticPages($query), $this->searchCmsContents($query));
        usort($results, fn ($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));

        return array_map(fn ($r) => collect($r)->except('score')->all(), $results);
    }

    private function searchStaticPages(string $query): array
    {
        return collect(self::PAGES)
            ->map(fn ($p) => ($score = $this->score($query, [$p[0], $p[1], $p[2], $p[4]])) > 0
                ? ['title' => $p[0], 'description' => $p[1], 'category' => $p[2], 'url' => route($p[3]), 'image' => null, 'score' => $score] : null)
            ->filter()->values()->all();
    }

    private function searchCmsContents(string $query): array
    {
        $results = [];
        foreach ($this->cms->definitions() as $menuSlug => $definition) {
            foreach ($this->cms->items($menuSlug) as $item) {
                $title = (string) data_get($item, 'judul', $definition['default_judul'] ?? $definition['nama_menu']);
                $description = (string) data_get($item, 'deskripsi', $definition['default_deskripsi'] ?? '');
                $menuName = (string) data_get($item, 'nama_menu', $definition['nama_menu']);
                $category = ucfirst((string) data_get($item, 'kategori', $definition['kategori']));
                $score = $this->score($query, [$title, $description, $menuName, $category, (string) $menuSlug]);
                if ($score > 0) {
                    $results[] = ['title' => $title, 'description' => $description ?: $menuName, 'category' => $category.' / '.$menuName, 'url' => data_get($item, 'link_berita') ?: $this->urlForCmsMenu($menuSlug), 'image' => data_get($item, 'gambar'), 'score' => $score + 5];
                }
            }
        }

        return $results;
    }

    private function score(string $query, array $fields): int
    {
        $needle = Str::lower($query);
        $score = 0;
        foreach ($fields as $index => $field) {
            $haystack = Str::lower(strip_tags((string) $field));
            if ($haystack === '') {
                continue;
            }
            if ($haystack === $needle) {
                $score += 50;
            }
            if (Str::contains($haystack, $needle)) {
                $score += max(10, 30 - ($index * 4));
            }
            foreach (preg_split('/\s+/', $needle) as $word) {
                if (Str::length($word) >= 3 && Str::contains($haystack, $word)) {
                    $score += max(2, 10 - $index);
                }
            }
        }

        return $score;
    }

    private function urlForCmsMenu(string $menuSlug): string
    {
        return match ($menuSlug) {
            'berita-acara' => route('luaran.berita'),
            'implementasi-kerja-sama' => route('luaran.kerjasama'),
            'pelatihan-juru-bahasa-isyarat' => route('luaran.pelatihan'),
            'kalender-akademik' => route('layanan.kalender'),
            'sosialisasi-inklusi-kampus' => route('program.inklusi'),
            'setara-pmbd' => route('program.setara'),
            'adik-beasiswa-yayasan' => route('program.beasiswa'),
            'pelita-disabilitas' => route('program.pelita'),
            'link' => route('program.link'),
            default => route('home'),
        };
    }
}
