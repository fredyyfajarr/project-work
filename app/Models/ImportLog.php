<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportLog extends Model
{
    use HasFactory;

    protected $table = 'import_logs';

    protected $primaryKey = 'id';

    protected $fillable = [
        'file',
        'total',
        'berhasil',
        'gagal',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'integer',
            'berhasil' => 'integer',
            'gagal' => 'integer',
        ];
    }
}
