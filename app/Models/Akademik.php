<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Akademik extends Model
{
    use HasFactory;

    protected $table = 'akademik';

    protected $primaryKey = 'idAkademik';

    public $timestamps = false;

    protected $fillable = [
        'idMahasiswa',
        'semester',
        'ips',
        'ipk',
    ];

    protected function casts(): array
    {
        return [
            'semester' => 'integer',
            'ips' => 'decimal:2',
            'ipk' => 'decimal:2',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }
}
