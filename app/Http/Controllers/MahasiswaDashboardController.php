<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAkademikRequest;
use App\Http\Requests\StoreAspirasiRequest;
use App\Http\Requests\StoreJadwalRequest;
use App\Http\Requests\StoreLuaranRequest;
use App\Http\Requests\UpdateProfilRequest;
use App\Models\Aktivitas;
use App\Models\Akademik;
use App\Models\Aspirasi;
use App\Models\JadwalMahasiswa;
use App\Models\Luaran;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaDashboardController extends Controller
{
    private function currentMahasiswa(): Mahasiswa
    {
        $user = Auth::user();
        $mahasiswa = $user?->idMahasiswa
            ? Mahasiswa::with(['akademik', 'luaran', 'keluarga', 'jadwal', 'aspirasi'])->find($user->idMahasiswa)
            : Mahasiswa::with(['akademik', 'luaran', 'keluarga', 'jadwal', 'aspirasi'])->where('nim', $user->username ?? null)->first();
        abort_if(! $mahasiswa, 403, 'Akun mahasiswa belum terhubung dengan data mahasiswa. Silakan hubungi admin.');

        return $mahasiswa;
    }

    private function uploadFile(Request $request, string $field, ?string $oldPath = null): ?string
    {
        if (! $request->hasFile($field)) {
            return $oldPath;
        }
        if ($oldPath && ! Str::startsWith($oldPath, ['http://', 'https://'])) {
            Storage::disk('public')->delete($oldPath);
        }

        return $request->file($field)->store('jadwal', 'public');
    }

    public function dashboard(): Response
    {
        $mahasiswa = $this->currentMahasiswa();
        $akademik = $mahasiswa->akademik()->orderBy('semester')->get();

        return Inertia::render('Mahasiswa/Dashboard', ['mahasiswa' => $mahasiswa, 'akademik' => $akademik, 'latest' => $akademik->sortByDesc('semester')->first(), 'luaranCount' => $mahasiswa->luaran()->count(), 'aspirasiCount' => $mahasiswa->aspirasi()->count(), 'jadwalCount' => $mahasiswa->jadwal()->count()]);
    }

    public function profil(): Response
    {
        return Inertia::render('Mahasiswa/Profil', ['mahasiswa' => $this->currentMahasiswa()]);
    }

    public function updateProfil(UpdateProfilRequest $request): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        $mahasiswa->update($request->validated());

        if ($request->filled('email')) {
            $user = Auth::user();
            if ($user) {
                $user->email = $request->email;
                $user->save();
            }
        }

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Kata sandi saat ini wajib diisi.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user = Auth::user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Kata sandi saat ini tidak cocok.']);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        Aktivitas::create([
            'user_id' => $user->idUser,
            'aktivitas' => 'Mahasiswa mengubah kata sandi mandiri',
        ]);

        return back()->with('success', 'Kata sandi Anda berhasil diperbarui.');
    }

    public function akademik(): Response
    {
        $mahasiswa = $this->currentMahasiswa();

        return Inertia::render('Mahasiswa/Akademik', ['mahasiswa' => $mahasiswa, 'akademik' => $mahasiswa->akademik()->orderBy('semester')->get()]);
    }

    public function storeAkademik(StoreAkademikRequest $request): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        $data = $request->validated();
        if (Akademik::where('idMahasiswa', $mahasiswa->idMahasiswa)->where('semester', $data['semester'])->exists()) {
            return back()->with('error', 'Data semester tersebut sudah ada. Silakan edit data yang sudah tersedia.');
        }
        Akademik::create($data + ['idMahasiswa' => $mahasiswa->idMahasiswa]);

        return back()->with('success', 'Data akademik berhasil ditambahkan.');
    }

    public function updateAkademik(StoreAkademikRequest $request, int $id): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        $akademik = Akademik::where('idMahasiswa', $mahasiswa->idMahasiswa)->findOrFail($id);
        $data = $request->validated();
        $duplikat = Akademik::where('idMahasiswa', $mahasiswa->idMahasiswa)->where('semester', $data['semester'])->where('idAkademik', '!=', $akademik->idAkademik)->exists();
        if ($duplikat) {
            return back()->with('error', 'Semester tersebut sudah digunakan.');
        }
        $akademik->update($data);

        return back()->with('success', 'Data akademik berhasil diperbarui.');
    }

    public function deleteAkademik(int $id): RedirectResponse
    {
        Akademik::where('idMahasiswa', $this->currentMahasiswa()->idMahasiswa)->findOrFail($id)->delete();

        return back()->with('success', 'Data akademik berhasil dihapus.');
    }

    public function luaran(): Response
    {
        $mahasiswa = $this->currentMahasiswa();

        return Inertia::render('Mahasiswa/Luaran', ['mahasiswa' => $mahasiswa, 'luaran' => $mahasiswa->luaran()->orderByDesc('created_at')->get()]);
    }

    public function storeLuaran(StoreLuaranRequest $request): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        $data = $request->validated();
        if ($request->hasFile('fileBukti')) {
            $data['fileBukti'] = $request->file('fileBukti')->store('luaran', 'public');
        }
        Luaran::create($data + ['idMahasiswa' => $mahasiswa->idMahasiswa, 'status' => 'pending']);

        return back()->with('success', 'Luaran berhasil dikirim dan menunggu validasi admin.');
    }

    public function jadwal(): Response
    {
        $mahasiswa = $this->currentMahasiswa();

        return Inertia::render('Mahasiswa/Jadwal', ['mahasiswa' => $mahasiswa, 'jadwal' => $mahasiswa->jadwal()->orderByDesc('semester')->orderByDesc('created_at')->get()]);
    }

    public function storeJadwal(StoreJadwalRequest $request): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        $data = $request->validated();
        if (JadwalMahasiswa::where('idMahasiswa', $mahasiswa->idMahasiswa)->where('semester', $data['semester'])->exists()) {
            return back()->with('error', 'Jadwal untuk semester tersebut sudah ada. Silakan edit file jadwal yang sudah diunggah.');
        }
        $file = $request->file('file_jadwal');
        JadwalMahasiswa::create(['idMahasiswa' => $mahasiswa->idMahasiswa, 'semester' => $data['semester'], 'judul_jadwal' => $data['judul_jadwal'] ?: 'Jadwal Kuliah Semester '.$data['semester'], 'file_jadwal' => $file->store('jadwal', 'public'), 'nama_file' => $file->getClientOriginalName(), 'tipe_file' => $file->getClientMimeType(), 'ukuran_file' => $file->getSize(), 'keterangan' => $data['keterangan'] ?? null, 'status' => 'aktif']);

        return back()->with('success', 'Jadwal per semester berhasil diunggah.');
    }

    public function updateJadwal(StoreJadwalRequest $request, int $id): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        $jadwal = JadwalMahasiswa::where('idMahasiswa', $mahasiswa->idMahasiswa)->findOrFail($id);
        $data = $request->validated();
        $duplikat = JadwalMahasiswa::where('idMahasiswa', $mahasiswa->idMahasiswa)->where('semester', $data['semester'])->where('idJadwal', '!=', $jadwal->idJadwal)->exists();
        if ($duplikat) {
            return back()->with('error', 'Semester tersebut sudah memiliki file jadwal.');
        }
        $payload = ['semester' => $data['semester'], 'judul_jadwal' => $data['judul_jadwal'] ?: 'Jadwal Kuliah Semester '.$data['semester'], 'keterangan' => $data['keterangan'] ?? null];
        if ($request->hasFile('file_jadwal')) {
            $file = $request->file('file_jadwal');
            $payload += ['file_jadwal' => $this->uploadFile($request, 'file_jadwal', $jadwal->file_jadwal), 'nama_file' => $file->getClientOriginalName(), 'tipe_file' => $file->getClientMimeType(), 'ukuran_file' => $file->getSize()];
        }
        $jadwal->update($payload);

        return back()->with('success', 'Jadwal per semester berhasil diperbarui.');
    }

    public function deleteJadwal(int $id): RedirectResponse
    {
        $jadwal = JadwalMahasiswa::where('idMahasiswa', $this->currentMahasiswa()->idMahasiswa)->findOrFail($id);
        if ($jadwal->file_jadwal && ! Str::startsWith($jadwal->file_jadwal, ['http://', 'https://'])) {
            Storage::disk('public')->delete($jadwal->file_jadwal);
        }
        $jadwal->delete();

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }

    public function aspirasi(): Response
    {
        $mahasiswa = $this->currentMahasiswa();

        return Inertia::render('Mahasiswa/Aspirasi', ['mahasiswa' => $mahasiswa, 'aspirasi' => $mahasiswa->aspirasi()->orderByDesc('created_at')->get()]);
    }

    public function storeAspirasi(StoreAspirasiRequest $request): RedirectResponse
    {
        $mahasiswa = $this->currentMahasiswa();
        Aspirasi::create($request->validated() + ['mahasiswa_id' => $mahasiswa->idMahasiswa, 'tanggal' => now()->format('Y-m-d'), 'status' => 'Diajukan']);

        return back()->with('success', 'Aspirasi berhasil dikirim.');
    }
}
