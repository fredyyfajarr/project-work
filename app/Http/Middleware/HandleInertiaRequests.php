<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()
                    ? $request->user()->only('idUser', 'username', 'email', 'role', 'status', 'idMahasiswa')
                    : null,
            ],
            'pendingResetCount' => fn () => $request->user() && in_array($request->user()->role, ['admin', 'staff', 'staff_serang', 'ketua'])
                ? \App\Models\PasswordResetRequest::where('status', 'pending')->count()
                : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
