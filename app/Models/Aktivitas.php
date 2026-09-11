<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aktivitas extends Model
{
    use HasFactory;

    protected $table = 'aktivitas';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'aktivitas',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'idUser');
    }
}
