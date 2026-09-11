<?php

namespace App\Services;

use App\Models\Luaran;
use App\Models\Mahasiswa;
use App\Models\NomorSurat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Query terpusat 5 jenis laporan. Dipakai index + export agar
 * blok filter tidak diduplikasi (masalah kode lama).
 */
class LaporanService
{
    public const JENIS = ['mahasiswa', 'akademik', 'monitoring', 'luaran', 'nomor_surat'];

    public function __construct(private readonly DisabilitasService $disabilitas)
    {
    }

    public static function jenisList(): array
    {
        return self::JENIS;
    }

    public function title(string $jenis): string
    {
        return match ($jenis) {
            'mahasiswa' => 'Laporan Mahasiswa',
            'akademik' => 'Laporan Akademik',
            'monitoring' => 'Laporan Monitoring',
            'luaran' => 'Laporan Luaran',
            'nomor_surat' => 'Laporan Nomor Surat',
            default => 'Laporan',
        };
    }

    public function jurusanOptions(): Collection
    {
        return Mahasiswa::select('jurusan')->whereNotNull('jurusan')->where('jurusan', '!=', '')
            ->distinct()->orderBy('jurusan')->pluck('jurusan');
    }

    /** Normalisasi filter request: kosong / 'semua' dianggap tidak ada filter. */
    public static function normalizeFilters(array $input): array
    {
        $filters = [];
        foreach (['jenis', 'jurusan', 'disabilitas', 'status', 'kondisi_ipk', 'tahun'] as $key) {
            $value = trim((string) ($input[$key] ?? ''));
            if ($value !== '' && strtolower($value) !== 'semua') {
                $filters[$key] = $value;
            }
        }

        return $filters;
    }

    public function query(string $jenis, array $filters): Builder
    {
        return match ($jenis) {
            'akademik' => $this->queryAkademik($filters),
            'monitoring' => $this->queryMonitoring($filters),
            'luaran' => Luaran::with('mahasiswa')->latest(),
            'nomor_surat' => $this->queryNomorSurat($filters),
            default => $this->queryMahasiswa($filters),
        };
    }

    public function paginate(string $jenis, array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query($jenis, $filters)->paginate($perPage)->withQueryString();
    }

    public function all(string $jenis, array $filters): Collection
    {
        return $this->query($jenis, $filters)->get();
    }

    /** Baris siap export: ['judul','header','rows']. */
    public function exportRows(string $jenis, array $filters): array
    {
        $data = $this->all($jenis, $filters);

        return match ($jenis) {
            'luaran' => ['judul' => $this->title($jenis), 'header' => ['NIM', 'Nama', 'Judul', 'Jenis', 'Tingkat', 'Tahun', 'Status'],
                'rows' => $data->map(fn ($l) => [$l->mahasiswa->nim ?? '-', $l->mahasiswa->nama ?? '-', $l->judul, $l->jenisLuaran, $l->tingkat, $l->tahun, $l->status])->toArray()],
            'nomor_surat' => ['judul' => $this->title($jenis), 'header' => ['Nomor Surat', 'Jenis', 'Perihal', 'Tanggal', 'Status'],
                'rows' => $data->map(fn ($s) => [$s->nomorSurat, $s->jenisSurat, $s->perihal, $s->tanggalSurat, $s->status])->toArray()],
            default => ['judul' => $this->title($jenis), 'header' => ['NIM', 'Nama', 'Jurusan', 'Angkatan', 'Disabilitas', 'IPK Terakhir', 'Status'],
                'rows' => $data->map(fn ($m) => [$m->nim, $m->nama, $m->jurusan, $m->angkatan, $m->disabilitas, $m->akademikTerbaru->ipk ?? '-', $m->status])->toArray()],
        };
    }

    public function exportHtml(string $jenis, array $filters): array
    {
        $export = $this->exportRows($jenis, $filters);
        $cells = fn ($tag, $row) => '<tr>'.collect($row)->map(fn ($c) => "<{$tag}>".e((string) $c)."</{$tag}>")->implode('').'</tr>';
        $html = '<h2>'.e($export['judul']).'</h2><table border="1" cellpadding="6" cellspacing="0"><thead>'.$cells('th', $export['header']).'</thead><tbody>'
            .collect($export['rows'])->map(fn ($r) => $cells('td', $r))->implode('').'</tbody></table>';

        return [$export['judul'], '<html><body style="font-family:sans-serif">'.$html.'</body></html>'];
    }

    private function baseMahasiswa(): Builder
    {
        return Mahasiswa::with('akademikTerbaru')->orderBy('nama');
    }

    private function applyJurusan(Builder $query, array $filters): void
    {
        if (isset($filters['jurusan'])) {
            $query->where('jurusan', $filters['jurusan']);
        }
    }

    private function applyStatus(Builder $query, array $filters): void
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
    }

    private function applyKondisiIpk(Builder $query, array $filters): void
    {
        if (($filters['kondisi_ipk'] ?? null) === 'bermasalah') {
            $query->whereHas('akademikTerbaru', fn ($q) => $q->whereNotNull('ipk')->where('ipk', '>', 0)->where('ipk', '<', 2.75));
        } elseif (($filters['kondisi_ipk'] ?? null) === 'aman') {
            $query->whereHas('akademikTerbaru', fn ($q) => $q->where('ipk', '>=', 2.75));
        }
    }

    private function queryMahasiswa(array $filters): Builder
    {
        $query = $this->baseMahasiswa();
        $this->applyJurusan($query, $filters);
        if (isset($filters['disabilitas'])) {
            $this->disabilitas->scope($query, $filters['disabilitas']);
        }
        $this->applyStatus($query, $filters);

        return $query;
    }

    private function queryAkademik(array $filters): Builder
    {
        $query = $this->baseMahasiswa();
        $this->applyJurusan($query, $filters);
        $this->applyKondisiIpk($query, $filters);

        return $query;
    }

    private function queryMonitoring(array $filters): Builder
    {
        $query = $this->baseMahasiswa();
        $this->applyStatus($query, $filters);
        $this->applyKondisiIpk($query, $filters);

        return $query;
    }

    private function queryNomorSurat(array $filters): Builder
    {
        $query = NomorSurat::query()->orderByDesc('tanggalSurat')->orderByDesc('idSurat');
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['tahun'])) {
            $query->whereYear('tanggalSurat', $filters['tahun']);
        }

        return $query;
    }
}
