<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Models\Aktivitas;
use App\Models\ImportLog;
use App\Models\Keluarga;
use App\Models\Mahasiswa;
use App\Services\DisabilitasService;
use App\Services\ImportService;
use App\Services\StudentAccountService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    private const KELUARGA_KEYS = ['namaAyah', 'namaIbu', 'pekerjaanAyah', 'pekerjaanIbu', 'noHpAyah', 'noHpIbu'];

    public function __construct(
        private readonly DisabilitasService $disabilitas,
        private readonly StudentAccountService $accounts,
        private readonly ImportService $imports,
    ) {
    }

    public function index(Request $request): Response
    {
        $query = Mahasiswa::with('akademikTerbaru')->orderBy('nama');
        if ($request->filled('jurusan')) {
            $query->where('jurusan', $request->input('jurusan'));
        }
        if ($request->filled('disabilitas')) {
            $this->disabilitas->scope($query, $request->input('disabilitas'));
        }
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($q) => $q->where('nama', 'like', "%{$search}%")->orWhere('nim', 'like', "%{$search}%"));
        }

        return Inertia::render('Admin/Mahasiswa/Index', [
            'data' => $query->paginate(15)->withQueryString(),
            'jurusan' => Mahasiswa::select('jurusan')->whereNotNull('jurusan')->distinct()->orderBy('jurusan')->pluck('jurusan'),
            'filters' => $request->only('jurusan', 'disabilitas', 'search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Mahasiswa/Create');
    }

    public function store(StoreMahasiswaRequest $request): RedirectResponse
    {
        $data = $this->normalized($request->validated());
        foreach (['fileKtp', 'fileKk', 'fileSuratKerja', 'fotoProfil'] as $docKey) {
            if ($request->hasFile($docKey)) {
                $data[$docKey] = $request->file($docKey)->store('documents/mahasiswa', 'public');
            }
        }
        $m = DB::transaction(function () use ($data) {
            $mahasiswa = Mahasiswa::create(Arr::except($data, self::KELUARGA_KEYS));
            Keluarga::create(['idMahasiswa' => $mahasiswa->idMahasiswa] + Arr::only($data, self::KELUARGA_KEYS));
            $this->accounts->syncOne($mahasiswa, true);

            return $mahasiswa;
        });
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Menambahkan data mahasiswa "'.$m->nama.'" dan membuat akun mahasiswa otomatis']);

        return redirect()->route('admin.mahasiswa.index')->with('success', 'Data mahasiswa berhasil ditambahkan.');
    }

    public function detail(int $id): Response
    {
        return Inertia::render('Admin/Mahasiswa/Detail', [
            'm' => Mahasiswa::with(['keluarga', 'akademik', 'beasiswa', 'luaran', 'jadwal', 'tracerTerbaru'])->findOrFail($id),
        ]);
    }

    public function cetakBiodata(Request $request, int $id)
    {
        $m = Mahasiswa::with(['keluarga', 'akademik' => fn ($q) => $q->orderBy('semester')])->findOrFail($id);

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Mencetak Lembar Biodata Resmi Mahasiswa "'.$m->nama.'" (NIM: '.($m->nim ?? '-').')',
        ]);

        $html = view('pdf.biodata_mahasiswa', compact('m'))->render();

        return Pdf::loadHtml($html)
            ->setPaper('a4', 'portrait')
            ->download('Biodata_Mahasiswa_'.($m->nim ?: $m->idMahasiswa).'.pdf');
    }

    public function edit(int $id): Response
    {
        return Inertia::render('Admin/Mahasiswa/Edit', ['m' => Mahasiswa::with(['keluarga', 'akademik'])->findOrFail($id)]);
    }

    public function update(UpdateMahasiswaRequest $request, int $id): RedirectResponse
    {
        $data = $this->normalized($request->validated());
        foreach (['fileKtp', 'fileKk', 'fileSuratKerja', 'fotoProfil'] as $docKey) {
            if ($request->hasFile($docKey)) {
                $data[$docKey] = $request->file($docKey)->store('documents/mahasiswa', 'public');
            }
        }
        $m = Mahasiswa::findOrFail($id);
        DB::transaction(function () use ($m, $id, $data) {
            $m->update(Arr::except($data, self::KELUARGA_KEYS));
            Keluarga::updateOrCreate(['idMahasiswa' => $id], Arr::only($data, self::KELUARGA_KEYS));
            $this->accounts->syncOne($m->fresh(), false);
        });
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Mengubah data mahasiswa "'.$m->nama.'"']);

        return redirect()->route('admin.mahasiswa.index')->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $m = Mahasiswa::findOrFail($id);
        $nama = $m->nama;
        $adminId = $request->user()->idUser;
        DB::transaction(function () use ($m, $adminId, $nama) {
            $m->akademik()->delete();
            $m->keluarga()->delete();
            $m->luaran()->delete();
            $m->jadwal()->delete();
            $m->aspirasi()->delete();
            $m->akun()->delete();
            $m->delete();
            Aktivitas::create(['user_id' => $adminId, 'aktivitas' => 'Menghapus mahasiswa "'.$nama.'" beserta data terkait']);
        });

        return redirect()->route('admin.mahasiswa.index')->with('success', 'Data mahasiswa dan seluruh data terkait berhasil dihapus.');
    }

    public function preview(Request $request): Response
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']], ['file.required' => 'File Excel wajib diunggah.', 'file.mimes' => 'File harus berformat XLSX atau XLS.']);
        $result = $this->imports->previewMahasiswa($request->file('file'));
        session(['preview_rows' => $result['mapped'], 'preview_stats' => $result['stats']]);

        return Inertia::render('Admin/Mahasiswa/Preview', $result);
    }

    public function cancelPreview(): RedirectResponse
    {
        session()->forget(['preview_rows', 'preview_stats']);

        return redirect()->route('admin.mahasiswa.index')->with('success', 'Import dibatalkan.');
    }

    public function import(Request $request): RedirectResponse
    {
        $mapped = session('preview_rows');
        abort_if(! $mapped, 422, 'Tidak ada data preview.');
        ['berhasil' => $berhasil, 'gagal' => $gagal, 'total' => $total] = $this->imports->importMahasiswa($mapped) + ['total' => count($mapped)];
        ImportLog::create(['file' => 'import_excel', 'total' => $total, 'berhasil' => $berhasil, 'gagal' => $gagal]);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Mengimpor '.$berhasil.' data mahasiswa dari file Excel']);
        session()->forget(['preview_rows', 'preview_stats']);

        return redirect()->route('admin.mahasiswa.index')->with('success', "Import selesai: {$berhasil} berhasil, {$gagal} gagal.");
    }

    private function normalized(array $data): array
    {
        $jenis = $this->disabilitas->normalize($data['disabilitas'] ?? null);
        if ($jenis) {
            $data['disabilitas'] = $jenis;
            $data['jenisHambatan'] = $jenis;
        }

        return $data;
    }
}
