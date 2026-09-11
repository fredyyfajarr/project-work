<?php

namespace App\Http\Controllers;

use App\Services\CmsContentService;
use App\Services\StatistikService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(
        private readonly CmsContentService $cms,
        private readonly StatistikService $statistik,
    ) {
    }

    public function home(): Response
    {
        return Inertia::render('Public/Home', [
            'pageTitle' => 'Beranda — LLD UNPAM',
            'beritaHome' => $this->cms->items('berita-acara'),
            'homeStats' => $this->statistik->publicCards(),
        ]);
    }

    public function sejarah(): Response
    {
        return Inertia::render('Public/Tentang/Sejarah', ['pageTitle' => 'Sejarah LLD — LLD UNPAM']);
    }

    public function sambutan(): Response
    {
        return Inertia::render('Public/Tentang/Sambutan', ['pageTitle' => 'Sambutan Kepala LLD — LLD UNPAM']);
    }

    public function visiMisi(): Response
    {
        return Inertia::render('Public/Tentang/VisiMisi', ['pageTitle' => 'Visi & Misi LLD — LLD UNPAM']);
    }

    public function struktur(): Response
    {
        return Inertia::render('Public/Tentang/Struktur', ['pageTitle' => 'Struktur Organisasi — LLD UNPAM']);
    }

    public function berita(): Response
    {
        return Inertia::render('Public/Luaran/Berita', ['pageTitle' => 'Berita Acara — LLD UNPAM', 'contents' => $this->cms->items('berita-acara'), 'sectionTitle' => 'Berita Acara']);
    }

    public function kerjasama(): Response
    {
        return Inertia::render('Public/Luaran/Kerjasama', ['pageTitle' => 'Implementasi Kerja Sama — LLD UNPAM', 'contents' => $this->cms->items('implementasi-kerja-sama'), 'sectionTitle' => 'Implementasi Kerja Sama']);
    }

    public function pelatihan(): Response
    {
        return Inertia::render('Public/Luaran/Pelatihan', ['pageTitle' => 'Pelatihan Juru Bahasa Isyarat — LLD UNPAM', 'contents' => $this->cms->items('pelatihan-juru-bahasa-isyarat'), 'sectionTitle' => 'Pelatihan Juru Bahasa Isyarat']);
    }

    public function pmb(): Response
    {
        return Inertia::render('Public/Layanan/Pmb', ['pageTitle' => 'PMB Mahasiswa Disabilitas — LLD UNPAM']);
    }

    public function volunteer(): Response
    {
        return Inertia::render('Public/Layanan/Volunteer', ['pageTitle' => 'Volunteer LLD — LLD UNPAM', 'volunteer' => $this->volunteerInfo()]);
    }

    public function kalender(): Response
    {
        return Inertia::render('Public/Layanan/Kalender', ['pageTitle' => 'Kalender Akademik — LLD UNPAM', 'contents' => $this->cms->items('kalender-akademik')]);
    }

    public function program(): Response
    {
        return Inertia::render('Public/Program/Index', ['pageTitle' => 'Program Kerja — LLD UNPAM', 'programSections' => $this->cms->sectionsByCategory('program')]);
    }

    public function inklusi(): Response
    {
        return $this->programDetail('sosialisasi-inklusi-kampus', 'Program Sosialisasi Inklusi Kampus — LLD UNPAM');
    }

    public function setara(): Response
    {
        return $this->programDetail('setara-pmbd', 'Program SETARA PMBD — LLD UNPAM');
    }

    public function beasiswa(): Response
    {
        return $this->programDetail('adik-beasiswa-yayasan', 'Program ADIK & Beasiswa Yayasan — LLD UNPAM');
    }

    public function pelita(): Response
    {
        return $this->programDetail('pelita-disabilitas', 'Program Pelita Disabilitas — LLD UNPAM');
    }

    public function link(): Response
    {
        return $this->programDetail('link', 'Program LINK — LLD UNPAM');
    }

    public function kontak(): Response
    {
        return Inertia::render('Public/Kontak', ['pageTitle' => 'Kontak — LLD UNPAM']);
    }

    public function kirimKontak(Request $request): RedirectResponse
    {
        $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100'],
            'pesan' => ['required', 'string', 'max:1000'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'pesan.required' => 'Pesan wajib diisi.',
        ]);

        return back()->with('success', 'Pesan berhasil divalidasi. Hubungkan ke database/email jika ingin menyimpan pesan.');
    }

    private function programDetail(string $menuSlug, string $pageTitle): Response
    {
        $definition = $this->cms->definition($menuSlug) ?? [];

        return Inertia::render('Public/Program/Detail', [
            'pageTitle' => $pageTitle,
            'sectionTitle' => $definition['nama_menu'] ?? 'Program LLD',
            'contents' => $this->cms->items($menuSlug),
        ]);
    }

    private function volunteerInfo(): array
    {
        return [
            'syarat' => ['Dosen Universitas Pamulang atau mahasiswa aktif (semester atas)', 'Bersedia terlibat aktif dalam kegiatan LLD', 'Bersedia mendampingi dan melayani mahasiswa disabilitas'],
            'alur' => ['Menghubungi LLD', 'Mengisi formulir pendaftaran relawan', 'Proses interview oleh LLD', 'Mengikuti pelatihan terkait pembelajaran disabilitas', 'Selesai & resmi menjadi volunteer'],
            'benefit' => ['Sertifikat Pelatihan', 'Sertifikat Volunteer', 'Pengalaman dalam pendidikan inklusif', 'Pengembangan soft skill & empati sosial'],
        ];
    }
}
