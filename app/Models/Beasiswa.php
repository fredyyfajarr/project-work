<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Beasiswa extends Model
{
    use HasFactory;

    protected $table = 'beasiswa';
    protected $primaryKey = 'idBeasiswa';

    protected $fillable = [
        'idMahasiswa',
        'nikKtp',
        'namaBank',
        'noRekening',
        'atasNama',
        'fileBukuTabungan',
        'jenisBeasiswa',
        'status',
        'catatan',
        'periode',
    ];

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }
}
