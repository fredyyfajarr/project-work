<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Luaran extends Model
{
    use HasFactory;

    protected $table = 'luaran';

    protected $primaryKey = 'idLuaran';

    protected $fillable = [
        'idMahasiswa',
        'judul',
        'jenisLuaran',
        'tingkat',
        'tahun',
        'deskripsi',
        'fileBukti',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }
}
