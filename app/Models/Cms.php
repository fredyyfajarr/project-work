<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cms extends Model
{
    use HasFactory;

    protected $table = 'cms';

    protected $primaryKey = 'idCms';

    protected $fillable = [
        'slug',
        'menu_slug',
        'kategori',
        'nama_menu',
        'judul',
        'deskripsi',
        'gambar',
        'link_berita',
        'urutan',
        'status',
        'tanggalUpdate',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
            'tanggalUpdate' => 'datetime',
        ];
    }

    /** @param Builder<Cms> $query */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'aktif');
    }

    /** @param Builder<Cms> $query */
    public function scopeByKategori(Builder $query, string $kategori): Builder
    {
        return $query->where('kategori', $kategori);
    }
}
