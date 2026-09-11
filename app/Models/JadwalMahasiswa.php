<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalMahasiswa extends Model
{
    use HasFactory;

    protected $table = 'jadwal_mahasiswa';

    protected $primaryKey = 'idJadwal';

    protected $fillable = [
        'idMahasiswa',
        'semester',
        'judul_jadwal',
        'file_jadwal',
        'nama_file',
        'tipe_file',
        'ukuran_file',
        'keterangan',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'semester' => 'integer',
            'ukuran_file' => 'integer',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }
}
