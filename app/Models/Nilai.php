<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nilai extends Model
{
    use HasFactory;

    protected $table = 'nilai';

    protected $primaryKey = 'id';

    protected $fillable = [
        'mahasiswa_id',
        'semester',
        'ips',
        'ipk',
    ];

    protected function casts(): array
    {
        return [
            'ips' => 'decimal:2',
            'ipk' => 'decimal:2',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id', 'idMahasiswa');
    }
}
