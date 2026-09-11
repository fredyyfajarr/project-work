<?php

namespace App\Services;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StudentAccountService
{
    public static function defaultPasswordForNim(?string $nim): string
    {
        $digits = preg_replace('/\D/', '', (string) $nim);
        $lastSix = substr($digits, -6);

        return 'lld#'.($lastSix !== '' ? $lastSix : '000000');
    }

    public static function defaultPasswordForRole(string $role): string
    {
        return match ($role) {
            'admin' => 'lld#staff',
            'staff' => 'lld#viktor',
            'staff_serang' => 'lld#serang',
            'ketua' => 'lld#kalem',
            default => 'lld#1234',
        };
    }

    public function syncOne(Mahasiswa $mahasiswa, bool $resetPassword = false): ?User
    {
        if (! $mahasiswa->nim) {
            return null;
        }

        $user = User::where('idMahasiswa', $mahasiswa->idMahasiswa)
            ->orWhere(fn ($q) => $q->where('role', 'mahasiswa')->where('username', $mahasiswa->nim))
            ->first();

        $status = strtolower((string) $mahasiswa->status) === 'nonaktif' ? 'nonaktif' : 'aktif';

        if (! $user) {
            return User::create([
                'username' => $mahasiswa->nim,
                'email' => $mahasiswa->email,
                'password' => Hash::make(self::defaultPasswordForNim($mahasiswa->nim)),
                'role' => 'mahasiswa',
                'idMahasiswa' => $mahasiswa->idMahasiswa,
                'status' => $status,
            ]);
        }

        $user->username = $mahasiswa->nim;
        $user->email = $mahasiswa->email ?: $user->email;
        $user->role = 'mahasiswa';
        $user->idMahasiswa = $mahasiswa->idMahasiswa;
        $user->status = $status;

        if ($resetPassword) {
            $user->password = Hash::make(self::defaultPasswordForNim($mahasiswa->nim));
        }

        $user->save();

        return $user;
    }

    public function syncMissing(bool $resetExistingPassword = false): array
    {
        $created = 0;
        $updated = 0;
        $skipped = 0;

        Mahasiswa::whereNotNull('nim')->orderBy('idMahasiswa')->chunk(100, function ($list) use (&$created, &$updated, &$skipped, $resetExistingPassword) {
            foreach ($list as $mahasiswa) {
                $existing = User::where('idMahasiswa', $mahasiswa->idMahasiswa)
                    ->orWhere(fn ($q) => $q->where('role', 'mahasiswa')->where('username', $mahasiswa->nim))
                    ->exists();

                $user = $this->syncOne($mahasiswa, $resetExistingPassword);

                if (! $user) {
                    $skipped++;
                } elseif ($existing) {
                    $updated++;
                } else {
                    $created++;
                }
            }
        });

        return compact('created', 'updated', 'skipped');
    }

    /** Reset password (hashed) dan kembalikan password plain untuk ditampilkan sekali. */
    public function resetPassword(User $user): string
    {
        $user->loadMissing('mahasiswa');

        $plain = $user->role === 'mahasiswa' && $user->mahasiswa
            ? self::defaultPasswordForNim($user->mahasiswa->nim)
            : self::defaultPasswordForRole($user->role);

        $user->password = Hash::make($plain);
        $user->save();

        return $plain;
    }
}
