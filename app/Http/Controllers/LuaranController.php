<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLuaranRequest;
use App\Models\Aktivitas;
use App\Models\Luaran;
use App\Models\Mahasiswa;
use App\Services\ImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LuaranController extends Controller
{
    public function __construct(private readonly ImportService $imports)
    {
    }

    public function index(Request $request): Response
    {
        $query = Luaran::with('mahasiswa')->latest();
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($q) => $q->where('judul', 'like', "%{$search}%")->orWhere('jenisLuaran', 'like', "%{$search}%")
                ->orWhereHas('mahasiswa', fn ($m) => $m->where('nama', 'like', "%{$search}%")->orWhere('nim', 'like', "%{$search}%")));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return Inertia::render('Admin/Luaran/Index', [
            'luaran' => $query->paginate(15)->withQueryString(),
            'mahasiswa' => Mahasiswa::orderBy('nama')->get(['idMahasiswa', 'nim', 'nama']),
            'totalPending' => Luaran::where('status', 'pending')->count(),
            'totalDiterima' => Luaran::where('status', 'diterima')->count(),
            'totalDitolak' => Luaran::where('status', 'ditolak')->count(),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function store(StoreLuaranRequest $request): RedirectResponse
    {
        $data = $request->validated();
        Luaran::create($data + ['status' => 'diterima']);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Menambahkan luaran mahasiswa secara manual']);

        return redirect()->route('admin.luaran.index')->with('success', 'Data luaran manual berhasil ditambahkan dan otomatis berstatus diterima.');
    }

    public function update(StoreLuaranRequest $request, int $id): RedirectResponse
    {
        $luaran = Luaran::findOrFail($id);
        $luaran->update($request->validated());

        return redirect()->route('admin.luaran.index')->with('success', 'Data luaran berhasil diperbarui.');
    }

    public function validasi(Request $request, int $id, string $status): RedirectResponse
    {
        abort_unless(in_array($status, ['pending', 'diterima', 'ditolak'], true), 404);

        $luaran = Luaran::findOrFail($id);
        $luaran->update(['status' => $status]);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Memvalidasi luaran "'.$luaran->judul.'" menjadi '.strtoupper($status)]);

        return redirect()->route('admin.luaran.index')->with('success', 'Status luaran berhasil diubah menjadi '.strtoupper($status).'.');
    }

    public function destroy(int $id): RedirectResponse
    {
        Luaran::findOrFail($id)->delete();

        return redirect()->route('admin.luaran.index')->with('success', 'Data luaran berhasil dihapus.');
    }

    public function preview(Request $request): Response
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']], ['file.required' => 'File Excel wajib diunggah.', 'file.mimes' => 'File harus berformat XLSX atau XLS.']);
        $preview = $this->imports->previewLuaran($request->file('file'));
        session(['preview_luaran' => $preview]);

        return Inertia::render('Admin/Luaran/Preview', ['preview' => $preview]);
    }

    public function importProcess(): RedirectResponse
    {
        $preview = session('preview_luaran');
        abort_if(! $preview, 422, 'Preview import tidak ditemukan.');
        $this->imports->importLuaran($preview);
        session()->forget('preview_luaran');

        return redirect()->route('admin.luaran.index')->with('success', 'Data luaran berhasil diimport.');
    }
}
