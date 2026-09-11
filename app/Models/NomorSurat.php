<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NomorSurat extends Model
{
    use HasFactory;

    protected $table = 'nomorsurat';

    protected $primaryKey = 'idSurat';

    protected $fillable = [
        'jenisSurat',
        'nomorSurat',
        'nomorUrut',
        'kodePejabat',
        'kodePerihal',
        'perihal',
        'tujuanSurat',
        'tanggalSurat',
        'bulanRomawi',
        'tahun',
        'penandatangan',
        'keterangan',
        'status',
        'idUser',
    ];

    protected function casts(): array
    {
        return [
            'tanggalSurat' => 'date',
            'tahun' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }
}
