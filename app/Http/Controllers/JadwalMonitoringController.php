<?php

namespace App\Http\Controllers;

use App\Models\JadwalMahasiswa;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalMonitoringController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'terunggah');
        $semester = $request->input('semester');
        $search = $request->input('search');

        // Query Mahasiswa yang sudah mengunggah jadwal
        $uploadedQuery = JadwalMahasiswa::query();
        if ($request->filled('semester')) {
            $uploadedQuery->where('semester', $semester);
        }
        $uploadedMahasiswaIds = $uploadedQuery->distinct()->pluck('idMahasiswa');

        // Statistik Kepatuhan Mahasiswa Aktif
        $mahasiswaAktifTotal = Mahasiswa::where('status', 'aktif')->count();
        $sudahUploadCount = Mahasiswa::where('status', 'aktif')->whereIn('idMahasiswa', $uploadedMahasiswaIds)->count();
        $belumUploadCount = max(0, $mahasiswaAktifTotal - $sudahUploadCount);

        // Tab 1: Jadwal Terunggah
        $queryJadwal = JadwalMahasiswa::with('mahasiswa')->orderByDesc('semester')->orderByDesc('created_at');
        if ($request->filled('search')) {
            $queryJadwal->where(fn ($q) => $q->where('judul_jadwal', 'like', "%{$search}%")
                ->orWhere('keterangan', 'like', "%{$search}%")
                ->orWhereHas('mahasiswa', fn ($m) => $m->where('nama', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%")
                    ->orWhere('jurusan', 'like', "%{$search}%")));
        }
        if ($request->filled('semester')) {
            $queryJadwal->where('semester', $semester);
        }

        // Tab 2: Mahasiswa Belum Mengunggah (Kepatuhan Jadwal KAK 8.1.2.a)
        $queryBelumUpload = Mahasiswa::where('status', 'aktif')
            ->whereNotIn('idMahasiswa', $uploadedMahasiswaIds)
            ->with('akademikTerbaru')
            ->orderBy('nama');

        if ($request->filled('search')) {
            $queryBelumUpload->where(fn ($q) => $q->where('nama', 'like', "%{$search}%")
                ->orWhere('nim', 'like', "%{$search}%")
                ->orWhere('jurusan', 'like', "%{$search}%"));
        }

        return Inertia::render('Admin/MonitoringJadwal/Index', [
            'jadwal' => $queryJadwal->paginate(15)->withQueryString(),
            'belumUpload' => $queryBelumUpload->paginate(15)->withQueryString(),
            'stats' => [
                'totalAktif' => $mahasiswaAktifTotal,
                'sudahUpload' => $sudahUploadCount,
                'belumUpload' => $belumUploadCount,
                'totalFile' => JadwalMahasiswa::count(),
            ],
            'tab' => $tab,
            'filters' => $request->only('search', 'semester', 'tab'),
        ]);
    }
}
