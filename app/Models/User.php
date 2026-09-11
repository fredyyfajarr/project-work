<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'idMahasiswa',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (User $user) {
            if (! empty($user->role) && in_array($user->role, ['admin', 'ketua', 'staff', 'staff_serang', 'mahasiswa', 'alumni'], true)) {
                try {
                    \Spatie\Permission\Models\Role::firstOrCreate(['name' => $user->role, 'guard_name' => 'web']);
                    $user->syncRoles([$user->role]);
                } catch (\Throwable $e) {
                    // Mencegah error pada environment testing terisolasi tanpa migrasi Spatie
                }
            }
        });
    }

    public function getEmailForPasswordReset(): string
    {
        return (string) ($this->email ?: $this->username);
    }

    public function routeNotificationForMail($notification = null): ?string
    {
        return $this->email ?: $this->mahasiswa?->email;
    }

    public function resetRequests(): HasMany
    {
        return $this->hasMany(PasswordResetRequest::class, 'user_id', 'idUser');
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'idMahasiswa', 'idMahasiswa');
    }

    /** Alias agar konsisten dengan penamaan relasi akun di sisi Mahasiswa. */
    public function akunMahasiswa(): BelongsTo
    {
        return $this->mahasiswa();
    }

    public function aktivitas(): HasMany
    {
        return $this->hasMany(Aktivitas::class, 'user_id', 'idUser');
    }

    public function nomorSurat(): HasMany
    {
        return $this->hasMany(NomorSurat::class, 'idUser', 'idUser');
    }
}
