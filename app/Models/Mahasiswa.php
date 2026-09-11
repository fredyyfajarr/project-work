<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected $primaryKey = 'idMahasiswa';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'nim',
        'nama',
        'jurusan',
        'angkatan',
        'jalurMasuk',
        'nik',
        'jenisKelamin',
        'tempatLahir',
        'tanggalLahir',
        'agama',
        'noHp',
        'email',
        'alamat',
        'jenisHambatan',
        'levelHambatan',
        'kemampuanMobilitas',
        'kemampuanBahasa',
        'jenisReguler',
        'fileKtp',
        'fileKk',
        'fileSuratKerja',
        'fotoProfil',
        'disabilitas',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggalLahir' => 'date',
            'angkatan' => 'integer',
        ];
    }

    public function akademik(): HasMany
    {
        return $this->hasMany(Akademik::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function akademikTerbaru(): HasOne
    {
        return $this->hasOne(Akademik::class, 'idMahasiswa', 'idMahasiswa')
            ->ofMany('semester', 'max');
    }

    public function keluarga(): HasOne
    {
        return $this->hasOne(Keluarga::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function akun(): HasOne
    {
        return $this->hasOne(User::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function luaran(): HasMany
    {
        return $this->hasMany(Luaran::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(JadwalMahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function aspirasi(): HasMany
    {
        return $this->hasMany(Aspirasi::class, 'mahasiswa_id', 'idMahasiswa');
    }

    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class, 'mahasiswa_id', 'idMahasiswa');
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class, 'mahasiswa_id', 'idMahasiswa');
    }

    public function beasiswa(): HasMany
    {
        return $this->hasMany(Beasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function beasiswaTerbaru(): HasOne
    {
        return $this->hasOne(Beasiswa::class, 'idMahasiswa', 'idMahasiswa')->ofMany('idBeasiswa', 'max');
    }

    public function tracerStudy(): HasMany
    {
        return $this->hasMany(TracerStudy::class, 'idMahasiswa', 'idMahasiswa');
    }

    public function tracerTerbaru(): HasOne
    {
        return $this->hasOne(TracerStudy::class, 'idMahasiswa', 'idMahasiswa')->ofMany('idTracer', 'max');
    }

    /** @param Builder<Mahasiswa> $query */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'aktif');
    }

    /** @param Builder<Mahasiswa> $query */
    public function scopeByDisabilitas(Builder $query, string $jenis): Builder
    {
        return $query->where('disabilitas', $jenis);
    }

    /** @param Builder<Mahasiswa> $query */
    public function scopeSearch(Builder $query, string $keyword): Builder
    {
        return $query->where(function (Builder $q) use ($keyword): void {
            $q->where('nama', 'like', "%{$keyword}%")
                ->orWhere('nim', 'like', "%{$keyword}%")
                ->orWhere('jurusan', 'like', "%{$keyword}%");
        });
    }
}
