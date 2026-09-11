<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Models\PasswordResetRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function loginForm(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'username.required' => 'Username wajib diisi.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $user = User::with('mahasiswa')->where('username', $credentials['username'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'username' => 'Username atau kata sandi yang Anda masukkan salah.',
            ])->onlyInput('username');
        }

        if (($user->status ?? 'aktif') !== 'aktif') {
            return back()->withErrors([
                'username' => 'Akun Anda berstatus nonaktif. Silakan hubungi Admin LLD.',
            ])->onlyInput('username');
        }

        if ($user->role === 'mahasiswa' && ! $user->mahasiswa) {
            return back()->withErrors([
                'username' => 'Akun mahasiswa belum terhubung dengan data profil. Silakan hubungi Admin LLD.',
            ])->onlyInput('username');
        }

        Auth::login($user, (bool) $request->boolean('remember'));
        $request->session()->regenerate();

        Aktivitas::create([
            'user_id' => $user->idUser,
            'aktivitas' => strtoupper($user->role).' login ke sistem',
        ]);

        $isAlumni = $user->role === 'alumni' || ($user->role === 'mahasiswa' && strtolower((string) $user->mahasiswa?->status) === 'lulus');

        if ($isAlumni) {
            return redirect()->intended(route('alumni.dashboard'));
        }

        if ($user->role === 'mahasiswa') {
            return redirect()->intended(route('mahasiswa.dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            Aktivitas::create([
                'user_id' => $user->idUser,
                'aktivitas' => strtoupper($user->role).' logout dari sistem',
            ]);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    public function forgotForm(): Response
    {
        return Inertia::render('Auth/Forgot');
    }

    public function forgotSend(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'email' => ['required', 'email'],
        ], [
            'username.required' => 'Username atau NIM wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
        ]);

        $user = User::with('mahasiswa')->where('username', trim($validated['username']))->first();

        if (! $user) {
            return back()->withErrors(['username' => 'Akun dengan Username/NIM tersebut tidak ditemukan.'])->onlyInput('username', 'email');
        }

        // Ambil email akun (cek user.email atau fallback mahasiswa.email)
        $userEmail = strtolower(trim((string) ($user->email ?: $user->mahasiswa?->email)));
        $inputEmail = strtolower(trim($validated['email']));

        if (! $userEmail || $userEmail !== $inputEmail) {
            return back()->withErrors(['email' => 'Alamat email tidak cocok dengan data akun yang terdaftar.'])->onlyInput('username', 'email');
        }

        // Periksa apakah sudah ada permohonan pending dalam 15 menit terakhir
        $existingPending = PasswordResetRequest::where('user_id', $user->idUser)
            ->where('status', 'pending')
            ->where('created_at', '>=', now()->subMinutes(15))
            ->first();

        if ($existingPending) {
            return back()->with('success', 'Permohonan reset kata sandi Anda sebelumnya sudah tercatat dan sedang menunggu persetujuan Admin LLD.');
        }

        // Simpan tiket permohonan baru
        PasswordResetRequest::create([
            'user_id' => $user->idUser,
            'username' => $user->username,
            'email' => $inputEmail,
            'status' => 'pending',
        ]);

        Aktivitas::create([
            'user_id' => $user->idUser,
            'aktivitas' => 'Mengajukan permohonan reset kata sandi akun '.$user->username,
        ]);

        return back()->with('success', 'Permohonan reset kata sandi berhasil diajukan. Mohon hubungi atau tunggu persetujuan dari Admin LLD UNPAM.');
    }

    public function resetForm(string $token): Response|RedirectResponse
    {
        $resetReq = PasswordResetRequest::where('token', $token)->first();

        if (! $resetReq || $resetReq->status !== 'approved') {
            return redirect()->route('login')->withErrors(['username' => 'Tautan reset tidak valid atau belum disetujui oleh Admin.']);
        }

        if ($resetReq->isExpired()) {
            return redirect()->route('login')->withErrors(['username' => 'Tautan reset kata sandi telah kedaluwarsa (berlaku 24 jam). Silakan ajukan permohonan baru.']);
        }

        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'username' => $resetReq->username,
        ]);
    }

    public function resetStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'token.required' => 'Token reset tidak ditemukan.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $resetReq = PasswordResetRequest::where('token', $validated['token'])->first();

        if (! $resetReq || $resetReq->status !== 'approved' || $resetReq->isExpired()) {
            return redirect()->route('login')->withErrors(['username' => 'Tautan reset tidak valid atau telah kedaluwarsa.']);
        }

        $user = $resetReq->user;
        if (! $user) {
            return redirect()->route('login')->withErrors(['username' => 'User akun tidak ditemukan.']);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        $resetReq->status = 'completed';
        $resetReq->save();

        Aktivitas::create([
            'user_id' => $user->idUser,
            'aktivitas' => 'Berhasil mereset kata sandi akun '.$user->username.' via persetujuan Admin',
        ]);

        return redirect()->route('login')->with('success', 'Kata sandi berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.');
    }
}
