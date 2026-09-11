<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratRequest;
use App\Models\NomorSurat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NomorSuratController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/NomorSurat/Index', ['data' => NomorSurat::latest()->paginate(15)]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/NomorSurat/Create');
    }

    public function store(StoreSuratRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $surat = DB::transaction(function () use ($data, $request) {
            // Kunci baris terakhir agar nomor urut anti-race (bukan count()+1 mentah).
            $last = NomorSurat::query()->lockForUpdate()->orderByDesc('nomorUrut')->orderByDesc('idSurat')->first();
            $next = ((int) ($last->nomorUrut ?? 0)) + 1;

            $bulan = (int) date('n', strtotime($data['tanggalSurat']));
            $tahun = date('Y', strtotime($data['tanggalSurat']));
            $nomorSurat = sprintf('%04d', $next).'/'.strtoupper($data['kodePejabat']).'/UNPAM/'.strtoupper($data['kodeSurat']).'/'.$this->bulanRomawi($bulan).'/'.$tahun;

            return NomorSurat::create([
                'jenisSurat' => $data['jenisSurat'], 'nomorSurat' => $nomorSurat, 'nomorUrut' => $next,
                'kodePejabat' => $data['kodePejabat'], 'kodePerihal' => $data['kodePerihal'] ?? null, 'kodeSurat' => $data['kodeSurat'],
                'perihal' => $data['perihal'], 'tujuanSurat' => $data['tujuanSurat'] ?? null, 'tanggalSurat' => $data['tanggalSurat'],
                'bulanRomawi' => $this->bulanRomawi($bulan), 'tahun' => $tahun, 'tahunSurat' => $tahun,
                'penandatangan' => $data['penandatangan'] ?? null, 'keterangan' => $data['keterangan'] ?? null,
                'status' => $data['status'] ?? 'draft', 'idUser' => $request->user()->idUser,
            ]);
        });

        return redirect()->route('admin.nomor-surat.index')->with('success', 'Nomor surat '.$surat->nomorSurat.' berhasil dibuat.');
    }

    private function bulanRomawi(int $bulan): string
    {
        return match ($bulan) {
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', default => 'XII',
        };
    }
}
