<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Models\Aspirasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AspirasiMonitoringController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Aspirasi::with('mahasiswa')->orderByDesc('created_at');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($q) => $q->where('subjek', 'like', "%{$search}%")->orWhere('kategori', 'like', "%{$search}%")->orWhere('pesan', 'like', "%{$search}%")
                ->orWhereHas('mahasiswa', fn ($m) => $m->where('nama', 'like', "%{$search}%")->orWhere('nim', 'like', "%{$search}%")->orWhere('jurusan', 'like', "%{$search}%")));
        }
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->input('kategori'));
        }

        return Inertia::render('Admin/MonitoringAspirasi/Index', ['aspirasi' => $query->paginate(15)->withQueryString(), 'filters' => $request->only('search', 'kategori')]);
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Diajukan,Dikirim,Diproses,Selesai'],
            'tanggapan' => ['nullable', 'string', 'max:2000'],
        ]);

        $aspirasi = Aspirasi::with('mahasiswa')->findOrFail($id);
        $aspirasi->status = $validated['status'];
        if ($request->has('tanggapan')) {
            $aspirasi->tanggapan = $validated['tanggapan'];
        }
        $aspirasi->save();

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Memperbarui status aspirasi #'.$aspirasi->id.' ("'.$aspirasi->subjek.'") menjadi '.$aspirasi->status,
        ]);

        return back()->with('success', 'Status dan tanggapan aspirasi berhasil diperbarui.');
    }
}
