<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Services\LaporanService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function __construct(private readonly LaporanService $laporan)
    {
    }

    public function index(Request $request): Response
    {
        $filters = LaporanService::normalizeFilters($request->only('jenis', 'jurusan', 'disabilitas', 'status', 'kondisi_ipk', 'tahun'));
        $jenis = $filters['jenis'] ?? null;

        return Inertia::render('Admin/Laporan/Index', [
            'jenis' => $jenis,
            'jenisList' => LaporanService::jenisList(),
            'jurusan' => $this->laporan->jurusanOptions(),
            'data' => $jenis && in_array($jenis, LaporanService::jenisList(), true) ? $this->laporan->paginate($jenis, $filters) : null,
            'filters' => $filters,
        ]);
    }

    public function export(Request $request)
    {
        $filters = LaporanService::normalizeFilters($request->only('jenis', 'jurusan', 'disabilitas', 'status', 'kondisi_ipk', 'tahun'));
        $jenis = $filters['jenis'] ?? 'mahasiswa';
        abort_unless(in_array($jenis, LaporanService::jenisList(), true), 404);

        $format = strtolower(trim($request->input('format', 'excel')));
        $export = $this->laporan->exportRows($jenis, $filters);

        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Mengunduh '.$export['judul'].' ('.strtoupper($format).')']);

        if ($format === 'pdf') {
            [$judul, $html] = $this->laporan->exportHtml($jenis, $filters);

            return Pdf::loadHtml($html)->download('laporan_'.$jenis.'.pdf');
        }

        $filename = 'laporan_'.$jenis.'.csv';

        return response()->streamDownload(function () use ($export) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $export['header']);
            foreach ($export['rows'] as $row) {
                fputcsv($out, array_map(fn ($c) => (string) ($c ?? ''), $row));
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
