<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aspirasi extends Model
{
    use HasFactory;

    protected $table = 'aspirasi';

    protected $primaryKey = 'id';

    protected $fillable = [
        'mahasiswa_id',
        'subjek',
        'kategori',
        'pesan',
        'tanggal',
        'status',
        'tanggapan',
    ];

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id', 'idMahasiswa');
    }
}
