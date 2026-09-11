<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAkademikRequest;
use App\Models\Akademik;
use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Services\ImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AkademikController extends Controller
{
    public function __construct(private readonly ImportService $imports)
    {
    }

    public function index(Request $request): Response
    {
        $query = Mahasiswa::with('akademikTerbaru')->orderBy('nama');
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($q) => $q->where('nama', 'like', "%{$search}%")->orWhere('nim', 'like', "%{$search}%"));
        }

        return Inertia::render('Admin/Akademik/Index', ['mahasiswa' => $query->paginate(15)->withQueryString(), 'filters' => $request->only('search')]);
    }

    public function show(int $id): Response
    {
        return Inertia::render('Admin/Akademik/Show', [
            'mahasiswa' => Mahasiswa::findOrFail($id),
            'riwayat' => Akademik::where('idMahasiswa', $id)->orderBy('semester')->get(),
        ]);
    }

    public function store(StoreAkademikRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (Akademik::where('idMahasiswa', $data['idMahasiswa'])->where('semester', $data['semester'])->exists()) {
            return back()->with('error', 'Semester tersebut sudah ada untuk mahasiswa ini.');
        }

        Akademik::create($data);
        $mahasiswa = Mahasiswa::find($data['idMahasiswa']);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Menambahkan data akademik semester '.$data['semester'].' mahasiswa "'.($mahasiswa->nama ?? '-').'"']);

        return back()->with('success', 'Data akademik berhasil ditambahkan.');
    }

    public function update(StoreAkademikRequest $request, int $id): RedirectResponse
    {
        $data = $request->validated();
        $akademik = Akademik::findOrFail($id);

        $duplikat = Akademik::where('idMahasiswa', $akademik->idMahasiswa)->where('semester', $data['semester'])->where('idAkademik', '!=', $akademik->idAkademik)->exists();
        if ($duplikat) {
            return back()->with('error', 'Semester tersebut sudah ada untuk mahasiswa ini.');
        }

        $akademik->update(['semester' => $data['semester'], 'ips' => $data['ips'], 'ipk' => $data['ipk']]);
        $mahasiswa = Mahasiswa::find($akademik->idMahasiswa);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Mengupdate data akademik semester '.$data['semester'].' mahasiswa "'.($mahasiswa->nama ?? '-').'"']);

        return back()->with('success', 'Data akademik berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $akademik = Akademik::findOrFail($id);
        $mahasiswa = Mahasiswa::find($akademik->idMahasiswa);
        $semester = $akademik->semester;
        $akademik->delete();
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Menghapus data akademik semester '.$semester.' mahasiswa "'.($mahasiswa->nama ?? '-').'"']);

        return back()->with('success', 'Data akademik berhasil dihapus.');
    }

    public function preview(Request $request): Response
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']], ['file.required' => 'File Excel wajib diunggah.', 'file.mimes' => 'File harus berformat XLSX atau XLS.']);
        $result = $this->imports->previewAkademik($request->file('file'));
        session(['preview_akademik' => $result['mapped']]);

        return Inertia::render('Admin/Akademik/Preview', $result);
    }

    public function importExcel(Request $request): RedirectResponse
    {
        $mapped = session('preview_akademik');
        abort_if(! $mapped, 422, 'Tidak ada data preview.');
        ['berhasil' => $berhasil] = $this->imports->importAkademik($mapped);
        session()->forget('preview_akademik');
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Import '.$berhasil.' data akademik']);

        return redirect()->route('admin.akademik.index')->with('success', "{$berhasil} data berhasil diimport.");
    }
}
