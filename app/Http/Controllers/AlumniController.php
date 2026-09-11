<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Models\Aspirasi;
use App\Models\Mahasiswa;
use App\Models\TracerStudy;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AlumniController extends Controller
{
    /** Dashboard Alumni */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $mahasiswa = $user->mahasiswa;

        $tracer = $mahasiswa ? TracerStudy::where('idMahasiswa', $mahasiswa->idMahasiswa)->latest()->first() : null;
        $aspirasiCount = $mahasiswa ? Aspirasi::where('mahasiswa_id', $mahasiswa->idMahasiswa)->count() : 0;

        return Inertia::render('Alumni/Dashboard', [
            'mahasiswa' => $mahasiswa,
            'tracer' => $tracer,
            'stats' => [
                'hasFilledTracer' => (bool) $tracer,
                'statusPekerjaan' => $tracer?->statusPekerjaan ?? 'Belum Diisi',
                'instansi' => $tracer?->namaInstansi ?? '-',
                'aspirasiCount' => $aspirasiCount,
            ],
        ]);
    }

    /** Form Tracer Study Alumni */
    public function tracerStudy(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;
        $tracer = $mahasiswa ? TracerStudy::where('idMahasiswa', $mahasiswa->idMahasiswa)->latest()->first() : null;

        return Inertia::render('Alumni/TracerStudy', [
            'mahasiswa' => $mahasiswa,
            'tracer' => $tracer,
        ]);
    }

    /** Simpan/Update Tracer Study */
    public function storeTracerStudy(Request $request): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;
        if (! $mahasiswa) {
            abort(403, 'Akses khusus alumni terdaftar.');
        }

        $validated = $request->validate([
            'statusPekerjaan' => ['required', 'string', 'in:Bekerja,Belum Bekerja,Wirausaha,Melanjutkan Studi,Lainnya'],
            'namaInstansi' => ['nullable', 'string', 'max:150'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'bidangPekerjaan' => ['nullable', 'string', 'max:100'],
            'jenisPekerjaan' => ['nullable', 'string', 'max:100'],
            'lokasiPekerjaan' => ['nullable', 'string', 'max:150'],
            'tahunMulai' => ['nullable', 'integer'],
            'masaTungguBulan' => ['nullable', 'integer', 'min:0'],
            'kesesuaianBidang' => ['nullable', 'string', 'in:Sangat Sesuai,Sesuai,Kurang Sesuai,Tidak Sesuai'],
            'pendapatanBulanan' => ['nullable', 'string', 'max:50'],
            'namaUniversitasLanjut' => ['nullable', 'string', 'max:150'],
            'prodiLanjut' => ['nullable', 'string', 'max:100'],
            'saranLayanan' => ['nullable', 'string', 'max:1000'],
        ], [
            'statusPekerjaan.required' => 'Status pekerjaan wajib dipilih.',
            'statusPekerjaan.in' => 'Pilihan status pekerjaan tidak valid.',
        ]);

        $tracer = TracerStudy::where('idMahasiswa', $mahasiswa->idMahasiswa)->latest()->first();

        if (! $tracer) {
            $tracer = new TracerStudy();
            $tracer->idMahasiswa = $mahasiswa->idMahasiswa;
        }

        $tracer->fill($validated);
        $tracer->save();

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Alumni "'.$mahasiswa->nama.'" mengisi data Tracer Study',
        ]);

        return back()->with('success', 'Data Tracer Study berhasil disimpan. Terima kasih atas partisipasi Anda.');
    }

    /** Profil Alumni */
    public function profil(Request $request): Response
    {
        $user = $request->user();
        $mahasiswa = $user->mahasiswa;

        return Inertia::render('Alumni/Profil', [
            'user' => $user,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    /** Update Profil Alumni */
    public function updateProfil(Request $request): RedirectResponse
    {
        $user = $request->user();
        $mahasiswa = $user->mahasiswa;

        $validated = $request->validate([
            'email' => ['nullable', 'email', 'max:100'],
            'noHp' => ['nullable', 'string', 'max:20'],
            'alamat' => ['nullable', 'string', 'max:500'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'fotoProfil' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($mahasiswa) {
            $mahasiswa->email = $validated['email'] ?? $mahasiswa->email;
            $mahasiswa->noHp = $validated['noHp'] ?? $mahasiswa->noHp;
            $mahasiswa->alamat = $validated['alamat'] ?? $mahasiswa->alamat;

            if ($request->hasFile('fotoProfil')) {
                $mahasiswa->fotoProfil = $request->file('fotoProfil')->store('avatars', 'public');
            }

            $mahasiswa->save();
        }

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $user->save();
        }

        Aktivitas::create([
            'user_id' => $user->idUser,
            'aktivitas' => 'Alumni "'.$user->username.'" memperbarui data profil akun',
        ]);

        return back()->with('success', 'Profil alumni berhasil diperbarui.');
    }

    /** Aspirasi Alumni */
    public function aspirasi(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;
        $aspirasi = $mahasiswa ? Aspirasi::where('mahasiswa_id', $mahasiswa->idMahasiswa)->latest()->get() : [];

        return Inertia::render('Alumni/Aspirasi', [
            'mahasiswa' => $mahasiswa,
            'aspirasi' => $aspirasi,
        ]);
    }

    /** Store Aspirasi Alumni */
    public function storeAspirasi(Request $request): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;
        if (! $mahasiswa) {
            abort(403, 'Akses khusus alumni terdaftar.');
        }

        $validated = $request->validate([
            'kategori' => ['required', 'string', 'max:100'],
            'pesan' => ['required', 'string'],
            'file_lampiran' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ]);

        $filePath = null;
        if ($request->hasFile('file_lampiran')) {
            $filePath = $request->file('file_lampiran')->store('aspirasi', 'public');
        }

        Aspirasi::create([
            'mahasiswa_id' => $mahasiswa->idMahasiswa,
            'kategori' => '[ALUMNI] '.$validated['kategori'],
            'pesan' => $validated['pesan'],
            'file_lampiran' => $filePath,
            'status' => 'Diajukan',
        ]);

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Alumni "'.$mahasiswa->nama.'" mengirim aspirasi baru',
        ]);

        return back()->with('success', 'Aspirasi Anda berhasil dikirim ke pihak LLD.');
    }

    /** Admin & Pimpinan Monitoring Alumni & Tracer Study */
    public function adminIndex(Request $request): Response
    {
        $query = Mahasiswa::with(['tracerTerbaru', 'akademikTerbaru'])
            ->where('status', 'lulus')
            ->orderBy('nama');

        if ($request->filled('jurusan')) {
            $query->where('jurusan', $request->input('jurusan'));
        }

        if ($request->filled('statusPekerjaan')) {
            $status = $request->input('statusPekerjaan');
            $query->whereHas('tracerTerbaru', function ($q) use ($status) {
                $q->where('statusPekerjaan', $status);
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('jurusan', 'like', "%{$search}%");
            });
        }

        $alumniList = $query->paginate(15)->withQueryString();

        // Statistik Tracer Study untuk Visual Chart
        $totalAlumni = Mahasiswa::where('status', 'lulus')->count();
        $tracerStats = [
            'totalLulus' => $totalAlumni,
            'sudahTracer' => TracerStudy::distinct('idMahasiswa')->count('idMahasiswa'),
            'bekerja' => TracerStudy::where('statusPekerjaan', 'Bekerja')->count(),
            'wirausaha' => TracerStudy::where('statusPekerjaan', 'Wirausaha')->count(),
            'studiLanjut' => TracerStudy::where('statusPekerjaan', 'Melanjutkan Studi')->count(),
            'belumBekerja' => TracerStudy::where('statusPekerjaan', 'Belum Bekerja')->count(),
            'sesuaiBidang' => TracerStudy::whereIn('kesesuaianBidang', ['Sangat Sesuai', 'Sesuai'])->count(),
        ];

        return Inertia::render('Admin/Alumni/Index', [
            'data' => $alumniList,
            'stats' => $tracerStats,
            'filters' => $request->only('jurusan', 'statusPekerjaan', 'search'),
            'jurusanList' => Mahasiswa::where('status', 'lulus')->whereNotNull('jurusan')->distinct()->pluck('jurusan'),
        ]);
    }

    /** Export Data Alumni & Tracer Study to CSV */
    public function exportTracer(Request $request): StreamedResponse
    {
        $fileName = 'data-alumni-tracer-lld-'.date('Ymd-His').'.csv';
        $query = Mahasiswa::with(['tracerTerbaru', 'akademikTerbaru'])
            ->where('status', 'lulus')
            ->orderBy('nama');

        if ($request->filled('jurusan')) {
            $query->where('jurusan', $request->input('jurusan'));
        }

        $records = $query->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        return response()->stream(function () use ($records) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM
            fputcsv($handle, ['NIM', 'Nama Alumni', 'Program Studi', 'Angkatan', 'Disabilitas', 'Status Pekerjaan', 'Nama Instansi/Perusahaan', 'Jabatan', 'Bidang Kerja', 'Masa Tunggu (Bulan)', 'Kesesuaian Bidang', 'No HP', 'Email']);

            foreach ($records as $m) {
                $t = $m->tracerTerbaru;
                fputcsv($handle, [
                    $m->nim ?? '-',
                    $m->nama ?? '-',
                    $m->jurusan ?? '-',
                    $m->angkatan ?? '-',
                    $m->disabilitas ?? '-',
                    $t?->statusPekerjaan ?? 'Belum Mengisi Tracer',
                    $t?->namaInstansi ?? '-',
                    $t?->jabatan ?? '-',
                    $t?->bidangPekerjaan ?? '-',
                    $t?->masaTungguBulan !== null ? $t->masaTungguBulan.' Bulan' : '-',
                    $t?->kesesuaianBidang ?? '-',
                    $m->noHp ?? '-',
                    $m->email ?? '-',
                ]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}
