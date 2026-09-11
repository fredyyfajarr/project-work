<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TracerStudy extends Model
{
    use HasFactory;

    protected $table = 'tracer_study';
    protected $primaryKey = 'idTracer';

    protected $fillable = [
        'idMahasiswa',
        'statusPekerjaan',
        'namaInstansi',
        'jabatan',
        'bidangPekerjaan',
        'jenisPekerjaan',
        'lokasiPekerjaan',
        'tahunMulai',
        'masaTungguBulan',
        'kesesuaianBidang',
        'pendapatanBulanan',
        'namaUniversitasLanjut',
        'prodiLanjut',
        'saranLayanan',
    ];

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }
}
