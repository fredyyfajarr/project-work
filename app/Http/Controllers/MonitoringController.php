<?php

namespace App\Http\Controllers;

use App\Models\Akademik;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringController extends Controller
{
    public function index(): Response
    {
        $chart = Akademik::selectRaw('semester, AVG(ipk) as rata_ipk')->groupBy('semester')->orderBy('semester')->get();

        return Inertia::render('Admin/Monitoring/Index', [
            'total' => Mahasiswa::count(),
            'rataIpk' => round((float) Akademik::whereNotNull('ipk')->where('ipk', '>', 0)->avg('ipk'), 2),
            'jumlahBermasalah' => $this->bermasalahQuery()->count(),
            'jumlahTerlambat' => $this->terlambatQuery()->count(),
            'lulus' => Mahasiswa::where('status', 'lulus')->count(),
            'aktif' => Mahasiswa::where('status', 'aktif')->count(),
            'cuti' => Mahasiswa::where('status', 'cuti')->count(),
            'nonaktif' => Mahasiswa::where('status', 'nonaktif')->count(),
            'labels' => $chart->pluck('semester'),
            'values' => $chart->pluck('rata_ipk'),
            'mahasiswa' => Mahasiswa::with('akademikTerbaru')->orderBy('nama')->paginate(15),
        ]);
    }

    public function monitoringDetail(int $id): Response
    {
        return Inertia::render('Admin/Monitoring/Detail', ['m' => Mahasiswa::with(['akademik', 'keluarga'])->findOrFail($id)]);
    }

    public function status(string $status): Response
    {
        abort_unless(in_array($status, ['aktif', 'cuti', 'nonaktif', 'lulus'], true), 404);

        return Inertia::render('Admin/Monitoring/Status', [
            'status' => $status,
            'data' => Mahasiswa::with('akademikTerbaru')->where('status', $status)->orderBy('nama')->paginate(15),
        ]);
    }

    public function lulus(): Response
    {
        return Inertia::render('Admin/Monitoring/Lulus', ['data' => Mahasiswa::with('akademikTerbaru')->where('status', 'lulus')->orderBy('nama')->paginate(15)]);
    }

    public function terlambat(): Response
    {
        return Inertia::render('Admin/Monitoring/Terlambat', ['data' => $this->terlambatQuery()->orderBy('nama')->paginate(15)]);
    }

    public function bermasalah(): Response
    {
        return Inertia::render('Admin/Monitoring/Bermasalah', ['data' => $this->bermasalahQuery()->orderBy('nama')->paginate(15)]);
    }

    private function bermasalahQuery()
    {
        return Mahasiswa::with('akademikTerbaru')->whereHas('akademikTerbaru', fn ($q) => $q->whereNotNull('ipk')->where('ipk', '>', 0)->where('ipk', '<', 2.75));
    }

    private function terlambatQuery()
    {
        return Mahasiswa::with('akademikTerbaru')->where('status', '!=', 'lulus')->whereHas('akademikTerbaru', fn ($q) => $q->where('semester', '>=', 8));
    }
}
