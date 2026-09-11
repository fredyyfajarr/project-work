<?php

namespace App\Http\Controllers;

use App\Models\JadwalMahasiswa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function jadwal(int $id)
    {
        $jadwal = JadwalMahasiswa::with('mahasiswa')->findOrFail($id);
        $user = Auth::user();

        abort_if(! $user, 403);

        if (($user->role ?? '') === 'mahasiswa' && (int) $jadwal->idMahasiswa !== (int) $user->idMahasiswa) {
            abort(403, 'Anda tidak berhak mengunduh file ini.');
        }

        $path = $jadwal->file_jadwal;
        abort_if(! $path, 404, 'File jadwal belum tersedia.');

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return redirect()->away($path);
        }

        abort_unless(Storage::disk('public')->exists($path), 404, 'File jadwal tidak ditemukan di storage.');

        return Storage::disk('public')->download($path, $jadwal->nama_file ?: basename($path));
    }
}
