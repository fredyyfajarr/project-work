<?php

namespace App\Services;

use App\Models\Akademik;
use App\Models\Mahasiswa;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Port StatistikService lama tanpa N+1: semua hitungan memakai
 * agregat query builder / whereHas, tidak ada get()+filter koleksi.
 */
class StatistikService
{
    public function __construct(
        private readonly CmsContentService $cms,
        private readonly DisabilitasService $disabilitas,
    ) {
    }

    public function publicCards(): array
    {
        $ringkasan = $this->ringkasanDasar();

        return [
            'mahasiswa_aktif' => ['label' => 'Mahasiswa Aktif', 'value' => $ringkasan['aktif']],
            'lulusan' => ['label' => 'Lulusan', 'value' => $ringkasan['lulus']],
            'program_kerja' => ['label' => 'Program Kerja', 'value' => count($this->cms->sectionsByCategory('program'))],
            'jenis_disabilitas' => ['label' => 'Jenis Disabilitas', 'value' => $ringkasan['jenis_disabilitas']],
        ];
    }

    public function dashboardCards(): array
    {
        $ringkasan = $this->ringkasanDasar();

        return [
            'total' => $ringkasan['total'],
            'netra' => $ringkasan['netra'],
            'rungu' => $ringkasan['rungu'],
            'daksa' => $ringkasan['daksa'],
        ];
    }

    public function detail(): array
    {
        $ringkasan = $this->ringkasanDasar();

        return [
            'cards' => $this->publicCards(),
            'ringkasan' => $ringkasan,
            'status' => $this->statistikStatus(),
            'disabilitas' => $this->statistikDisabilitas(),
            'jurusan' => $this->statistikJurusan(),
            'angkatan' => $this->statistikAngkatan(),
            'akademik' => $this->statistikAkademik(),
        ];
    }

    public function jurusanUntukDashboard()
    {
        return collect($this->statistikJurusan())->pluck('total', 'label');
    }

    private function ringkasanDasar(): array
    {
        return $this->safe(function () {
            return [
                'total' => Mahasiswa::count(),
                'aktif' => Mahasiswa::where('status', 'aktif')->count(),
                'lulus' => Mahasiswa::where('status', 'lulus')->count(),
                'cuti' => Mahasiswa::where('status', 'cuti')->count(),
                'nonaktif' => Mahasiswa::where('status', 'nonaktif')->count(),
                'netra' => $this->countByJenis('Netra'),
                'rungu' => $this->countByJenis('Rungu'),
                'daksa' => $this->countByJenis('Daksa'),
                'jenis_disabilitas' => count(DisabilitasService::JENIS),
            ];
        }, ['total' => 0, 'aktif' => 0, 'lulus' => 0, 'cuti' => 0, 'nonaktif' => 0, 'netra' => 0, 'rungu' => 0, 'daksa' => 0, 'jenis_disabilitas' => 3]);
    }

    private function countByJenis(string $jenis): int
    {
        $query = Mahasiswa::query();
        $this->disabilitas->scope($query, $jenis);

        return (clone $query)->count();
    }

    private function statistikStatus(): array
    {
        return $this->safe(function () {
            return Mahasiswa::select('status', DB::raw('COUNT(*) as total'))
                ->whereNotNull('status')->where('status', '!=', '')
                ->groupBy('status')->orderByDesc('total')->get()
                ->map(fn ($row) => ['label' => ucfirst((string) $row->status), 'total' => (int) $row->total])
                ->toArray();
        }, []);
    }

    private function statistikDisabilitas(): array
    {
        return collect(DisabilitasService::JENIS)
            ->map(fn ($jenis) => ['label' => $jenis, 'total' => $this->countByJenis($jenis)])
            ->toArray();
    }

    private function statistikJurusan(): array
    {
        return $this->safe(function () {
            return Mahasiswa::select('jurusan', DB::raw('COUNT(*) as total'))
                ->whereNotNull('jurusan')->where('jurusan', '!=', '')
                ->groupBy('jurusan')->orderByDesc('total')->get()
                ->map(fn ($row) => ['label' => (string) $row->jurusan, 'total' => (int) $row->total])
                ->toArray();
        }, []);
    }

    private function statistikAngkatan(): array
    {
        return $this->safe(function () {
            return Mahasiswa::select('angkatan', DB::raw('COUNT(*) as total'))
                ->whereNotNull('angkatan')->where('angkatan', '!=', '')
                ->groupBy('angkatan')->orderBy('angkatan')->get()
                ->map(fn ($row) => ['label' => (string) $row->angkatan, 'total' => (int) $row->total])
                ->toArray();
        }, []);
    }

    private function statistikAkademik(): array
    {
        return $this->safe(function () {
            return [
                'rata_ipk' => round((float) Akademik::whereNotNull('ipk')->where('ipk', '>', 0)->avg('ipk'), 2),
                'rata_ips' => round((float) Akademik::whereNotNull('ips')->where('ips', '>', 0)->avg('ips'), 2),
                'bermasalah' => Mahasiswa::whereHas('akademikTerbaru', fn ($q) => $q->whereNotNull('ipk')->where('ipk', '>', 0)->where('ipk', '<', 2.75))->count(),
                'terlambat_lulus' => Mahasiswa::where('status', '!=', 'lulus')->whereHas('akademikTerbaru', fn ($q) => $q->where('semester', '>=', 8))->count(),
            ];
        }, ['rata_ipk' => 0, 'rata_ips' => 0, 'bermasalah' => 0, 'terlambat_lulus' => 0]);
    }

    private function safe(callable $callback, mixed $fallback): mixed
    {
        try {
            return $callback();
        } catch (Throwable $e) {
            report($e);

            return $fallback;
        }
    }
}
