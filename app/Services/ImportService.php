<?php

namespace App\Services;

use App\Models\Akademik;
use App\Models\Keluarga;
use App\Models\Luaran;
use App\Models\Mahasiswa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Throwable;

/**
 * Plumbing import Excel (preview + eksekusi) untuk mahasiswa,
 * akademik, dan luaran. Controller tetap tipis: validasi file
 * via FormRequest/validate, eksekusi via service ini.
 */
class ImportService
{
    public function __construct(
        private readonly DisabilitasService $disabilitas,
        private readonly StudentAccountService $accounts,
    ) {
    }

    /** @return array{mapped: array, stats: array, headers: array} */
    public function previewMahasiswa(UploadedFile $file): array
    {
        $rows = Excel::toArray(new \stdClass, $file)[0] ?? [];
        abort_if(count($rows) < 2, 422, 'File kosong / tidak valid.');

        $headers = array_map(fn ($h) => strtolower(trim((string) $h)), $rows[0]);
        $mapped = [];
        $stats = ['total' => 0, 'valid' => 0, 'invalid' => 0];

        foreach (array_slice($rows, 1) as $r) {
            $row = [];
            foreach ($headers as $idx => $key) {
                $row[$key] = $r[$idx] ?? null;
            }
            $stats['total']++;
            $errors = [];
            if (empty($row['nim'])) {
                $errors[] = 'NIM kosong';
            }
            if (empty($row['nama_mahasiswa'])) {
                $errors[] = 'Nama kosong';
            }
            if (! empty($row['nim']) && Mahasiswa::where('nim', $row['nim'])->exists()) {
                $errors[] = 'NIM sudah ada (duplikat)';
            }
            $row['nama_mahasiswa'] = isset($row['nama_mahasiswa']) ? strtoupper($row['nama_mahasiswa']) : null;
            $status = empty($errors) ? 'valid' : 'invalid';
            $stats[$status]++;
            $mapped[] = ['data' => $row, 'status' => $status, 'errors' => $errors];
        }

        return ['mapped' => $mapped, 'stats' => $stats, 'headers' => $headers];
    }

    /** @return array{berhasil: int, gagal: int} */
    public function importMahasiswa(array $mapped): array
    {
        $berhasil = 0;
        $gagal = 0;

        DB::transaction(function () use ($mapped, &$berhasil, &$gagal) {
            foreach ($mapped as $item) {
                if (($item['status'] ?? null) !== 'valid') {
                    $gagal++;
                    continue;
                }
                try {
                    $row = $item['data'];
                    $jenis = $this->disabilitas->normalize($row['jenis_kebutuhan_khusus'] ?? null);
                    $m = Mahasiswa::create([
                        'nim' => $row['nim'], 'nama' => $row['nama_mahasiswa'], 'jurusan' => $row['program_studi'] ?? null,
                        'angkatan' => $row['tahun_masuk'] ?? null, 'jalurMasuk' => $row['keterangan_tambahan'] ?? 'Reguler',
                        'jenisKelamin' => $row['jenis_kelamin'] ?? null, 'nik' => $row['nik'] ?? null, 'agama' => $row['agama'] ?? null,
                        'noHp' => $row['no_hp'] ?? null, 'email' => $row['email'] ?? null, 'alamat' => $row['alamat'] ?? null,
                        'disabilitas' => $jenis, 'jenisHambatan' => $jenis, 'levelHambatan' => $row['level_hambatan'] ?? 'Sedang',
                        'kemampuanMobilitas' => $row['mobilitas'] ?? null, 'kemampuanBahasa' => $row['kemampuan_bahasa'] ?? null,
                    ]);
                    $this->accounts->syncOne($m, true);
                    Keluarga::create(['idMahasiswa' => $m->idMahasiswa, 'namaAyah' => $row['nama_ayah'] ?? null, 'namaIbu' => $row['nama_ibu'] ?? null, 'pekerjaanAyah' => $row['pekerjaan_ayah'] ?? null, 'pekerjaanIbu' => $row['pekerjaan_ibu'] ?? null, 'noHpAyah' => $row['no_hp_ayah'] ?? null, 'noHpIbu' => $row['no_hp_ibu'] ?? null]);
                    $berhasil++;
                } catch (Throwable) {
                    $gagal++;
                }
            }
        });

        return compact('berhasil', 'gagal');
    }

    /** @return array{mapped: array, valid: int, invalid: int} */
    public function previewAkademik(UploadedFile $file): array
    {
        $rows = Excel::toArray(new \stdClass, $file)[0] ?? [];
        abort_if(count($rows) < 2, 422, 'File kosong / tidak valid.');

        $header = array_map(fn ($h) => strtolower(trim((string) $h)), $rows[0]);
        $mapped = [];
        $valid = 0;
        $invalid = 0;

        foreach (array_slice($rows, 1) as $row) {
            $data = array_combine($header, array_pad($row, count($header), null));
            $errors = [];
            $mahasiswa = isset($data['nim']) ? Mahasiswa::where('nim', $data['nim'])->first() : null;
            if (! $mahasiswa) {
                $errors[] = 'NIM tidak ditemukan';
            } elseif (Akademik::where('idMahasiswa', $mahasiswa->idMahasiswa)->where('semester', $data['semester'] ?? null)->exists()) {
                $errors[] = 'Semester sudah ada';
            }
            if (! is_numeric($data['ips'] ?? null) || ! is_numeric($data['ipk'] ?? null)) {
                $errors[] = 'IPS/IPK harus angka';
            }
            $status = empty($errors) ? 'valid' : 'invalid';
            $status === 'valid' ? $valid++ : $invalid++;
            $mapped[] = ['status' => $status, 'error' => implode(', ', $errors), 'data' => $data];
        }

        return compact('mapped', 'valid', 'invalid');
    }

    /** @return array{berhasil: int, gagal: int} */
    public function importAkademik(array $mapped): array
    {
        $berhasil = 0;
        $gagal = 0;

        foreach ($mapped as $item) {
            if (($item['status'] ?? null) !== 'valid') {
                $gagal++;
                continue;
            }
            $mahasiswa = Mahasiswa::where('nim', $item['data']['nim'] ?? null)->first();
            if (! $mahasiswa) {
                $gagal++;
                continue;
            }
            Akademik::create(['idMahasiswa' => $mahasiswa->idMahasiswa, 'semester' => $item['data']['semester'], 'ips' => $item['data']['ips'], 'ipk' => $item['data']['ipk']]);
            $berhasil++;
        }

        return compact('berhasil', 'gagal');
    }

    public function previewLuaran(UploadedFile $file): array
    {
        $rows = IOFactory::load($file->getRealPath())->getActiveSheet()->toArray();
        $preview = [];

        foreach (array_slice($rows, 1) as $row) {
            if (empty($row[0])) {
                continue;
            }
            $mahasiswa = Mahasiswa::where('nim', $row[0])->first();
            $preview[] = [
                'nim' => $row[0] ?? '', 'judul' => $row[1] ?? '', 'jenisLuaran' => $row[2] ?? '', 'tingkat' => $row[3] ?? '',
                'tahun' => $row[4] ?? '', 'deskripsi' => $row[5] ?? '', 'fileBukti' => $row[6] ?? '',
                'valid' => (bool) $mahasiswa,
                'duplicate' => $mahasiswa ? Luaran::where('idMahasiswa', $mahasiswa->idMahasiswa)->where('judul', $row[1] ?? '')->exists() : false,
            ];
        }

        return $preview;
    }

    public function importLuaran(array $preview): void
    {
        foreach ($preview as $item) {
            if (! ($item['valid'] ?? false) || ($item['duplicate'] ?? false)) {
                continue;
            }
            $mahasiswa = Mahasiswa::where('nim', $item['nim'])->first();
            if (! $mahasiswa) {
                continue;
            }
            Luaran::create(['idMahasiswa' => $mahasiswa->idMahasiswa, 'judul' => $item['judul'], 'jenisLuaran' => $item['jenisLuaran'], 'tingkat' => $item['tingkat'], 'tahun' => $item['tahun'], 'deskripsi' => $item['deskripsi'], 'fileBukti' => $item['fileBukti'], 'status' => 'diterima']);
        }
    }
}
