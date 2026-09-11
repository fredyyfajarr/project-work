<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Keluarga extends Model
{
    use HasFactory;

    protected $table = 'keluarga';

    protected $primaryKey = 'idKeluarga';

    public $timestamps = false;

    protected $fillable = [
        'idMahasiswa',
        'namaAyah',
        'namaIbu',
        'pekerjaanAyah',
        'pekerjaanIbu',
        'noHpAyah',
        'noHpIbu',
    ];

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }
}
