<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Models\Beasiswa;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BeasiswaController extends Controller
{
    /** Admin & Kabid Viktor Beasiswa Management */
    public function adminIndex(Request $request): Response
    {
        $query = Beasiswa::with('mahasiswa')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('mahasiswa', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('jurusan', 'like', "%{$search}%");
            })->orWhere('noRekening', 'like', "%{$search}%")
              ->orWhere('namaBank', 'like', "%{$search}%")
              ->orWhere('atasNama', 'like', "%{$search}%");
        }

        return Inertia::render('Admin/Beasiswa/Index', [
            'data' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('status', 'search'),
            'stats' => [
                'total' => Beasiswa::count(),
                'menunggu' => Beasiswa::where('status', 'Menunggu Verifikasi')->count(),
                'disetujui' => Beasiswa::where('status', 'Disetujui')->count(),
                'ditolak' => Beasiswa::where('status', 'Ditolak')->count(),
            ],
        ]);
    }

    /** Verifikasi status beasiswa oleh Admin / Kabid Viktor */
    public function verifikasi(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:Disetujui,Ditolak,Menunggu Verifikasi'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ]);

        $beasiswa = Beasiswa::with('mahasiswa')->findOrFail($id);
        $beasiswa->status = $request->input('status');
        $beasiswa->catatan = $request->input('catatan');
        $beasiswa->save();

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Memverifikasi beasiswa mahasiswa "'.$beasiswa->mahasiswa?->nama.'" menjadi '.strtoupper($beasiswa->status),
        ]);

        return back()->with('success', 'Status verifikasi beasiswa berhasil diperbarui.');
    }

    /** Mahasiswa Beasiswa Page */
    public function mahasiswaIndex(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;
        if (! $mahasiswa) {
            abort(403, 'Akses khusus mahasiswa aktif.');
        }

        $beasiswa = Beasiswa::where('idMahasiswa', $mahasiswa->idMahasiswa)->latest()->first();

        return Inertia::render('Mahasiswa/Beasiswa', [
            'beasiswa' => $beasiswa,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    /** Mahasiswa Store / Update Data Beasiswa */
    public function mahasiswaStore(Request $request): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;
        if (! $mahasiswa) {
            abort(403, 'Akses khusus mahasiswa aktif.');
        }

        $validated = $request->validate([
            'nikKtp' => ['nullable', 'string', 'max:30'],
            'namaBank' => ['required', 'string', 'max:100'],
            'noRekening' => ['required', 'string', 'max:50'],
            'atasNama' => ['required', 'string', 'max:150'],
            'jenisBeasiswa' => ['nullable', 'string', 'max:100'],
            'periode' => ['nullable', 'string', 'max:50'],
            'fileBukuTabungan' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ], [
            'namaBank.required' => 'Nama bank wajib diisi.',
            'noRekening.required' => 'Nomor rekening wajib diisi.',
            'atasNama.required' => 'Nama pemilik rekening wajib diisi.',
            'fileBukuTabungan.mimes' => 'File buku tabungan harus berformat PDF, JPG, JPEG, atau PNG.',
            'fileBukuTabungan.max' => 'Ukuran file maksimal 5MB.',
        ]);

        $beasiswa = Beasiswa::where('idMahasiswa', $mahasiswa->idMahasiswa)->latest()->first();

        if (! $beasiswa) {
            $beasiswa = new Beasiswa();
            $beasiswa->idMahasiswa = $mahasiswa->idMahasiswa;
        }

        $beasiswa->nikKtp = $validated['nikKtp'] ?? $mahasiswa->nik;
        $beasiswa->namaBank = $validated['namaBank'];
        $beasiswa->noRekening = $validated['noRekening'];
        $beasiswa->atasNama = $validated['atasNama'];
        $beasiswa->jenisBeasiswa = $validated['jenisBeasiswa'] ?? 'Beasiswa Disabilitas';
        $beasiswa->periode = $validated['periode'] ?? date('Y');
        $beasiswa->status = 'Menunggu Verifikasi';

        if ($request->hasFile('fileBukuTabungan')) {
            $beasiswa->fileBukuTabungan = $request->file('fileBukuTabungan')->store('beasiswa/buku_tabungan', 'public');
        }

        $beasiswa->save();

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Mahasiswa "'.$mahasiswa->nama.'" mengajukan/memperbarui data rekening beasiswa',
        ]);

        return back()->with('success', 'Data beasiswa dan rekening Anda berhasil dikirim untuk verifikasi.');
    }

    /** Export Beasiswa to CSV */
    public function export(Request $request): StreamedResponse
    {
        $fileName = 'data-beasiswa-lld-'.date('Ymd-His').'.csv';
        $query = Beasiswa::with('mahasiswa')->orderBy('idBeasiswa', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $records = $query->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        return response()->stream(function () use ($records) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM
            fputcsv($handle, ['ID', 'NIM', 'Nama Mahasiswa', 'Program Studi', 'Disabilitas', 'Nama Bank', 'No Rekening', 'Atas Nama', 'Jenis Beasiswa', 'Status', 'Catatan', 'Tanggal Pengajuan']);

            foreach ($records as $b) {
                fputcsv($handle, [
                    $b->idBeasiswa,
                    $b->mahasiswa?->nim ?? '-',
                    $b->mahasiswa?->nama ?? '-',
                    $b->mahasiswa?->jurusan ?? '-',
                    $b->mahasiswa?->disabilitas ?? '-',
                    $b->namaBank,
                    $b->noRekening,
                    $b->atasNama,
                    $b->jenisBeasiswa,
                    $b->status,
                    $b->catatan ?? '-',
                    $b->created_at ? $b->created_at->format('d/m/Y H:i') : '-',
                ]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}
