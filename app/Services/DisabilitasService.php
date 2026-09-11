<?php

namespace App\Services;

/**
 * Normalisasi + scope query jenis disabilitas.
 * Menggabungkan duplikasi logika lama (Netra/Rungu+Daksa tersebar
 * di MahasiswaController, LaporanController, AdminController).
 */
class DisabilitasService
{
    public const JENIS = ['Netra', 'Rungu', 'Daksa'];

    public function normalize(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        $lower = strtolower($value);

        if (str_contains($lower, 'netra')) {
            return 'Netra';
        }

        if (str_contains($lower, 'rungu') || str_contains($lower, 'tuli')) {
            return 'Rungu';
        }

        if (str_contains($lower, 'daksa')) {
            return 'Daksa';
        }

        return $value;
    }

    /** Terapkan filter jenis ke query builder mahasiswa. */
    public function scope($query, string $jenis): void
    {
        $jenis = $this->normalize($jenis) ?? $jenis;

        $query->where(function ($q) use ($jenis) {
            match ($jenis) {
                'Netra' => $q->where('disabilitas', 'LIKE', '%netra%'),
                'Rungu' => $q->where('disabilitas', 'LIKE', '%rungu%')
                    ->orWhere('disabilitas', 'LIKE', '%tuli%'),
                'Daksa' => $q->where('disabilitas', 'LIKE', '%daksa%'),
                default => $q->where('disabilitas', $jenis),
            };
        });
    }

    public function labels(): array
    {
        return self::JENIS;
    }
}
