<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\PasswordResetRequest;
use App\Models\User;
use App\Services\StudentAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly StudentAccountService $accounts)
    {
    }

    public function index(): Response
    {
        $syncInfo = $this->accounts->syncMissing(false);

        return Inertia::render('Admin/User/Index', [
            'data' => User::with('mahasiswa')->orderBy('username')->paginate(15),
            'syncInfo' => $syncInfo,
            'totalMahasiswa' => Mahasiswa::whereNotNull('nim')->count(),
            'akunMahasiswa' => User::where('role', 'mahasiswa')->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/User/Create', [
            'mahasiswa' => Mahasiswa::whereNotNull('nim')->whereDoesntHave('akun')->orderBy('nama')->get(['idMahasiswa', 'nim', 'nama']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'role' => ['required', 'string'],
            'username' => ['required_unless:role,mahasiswa', 'string', 'max:50', 'unique:user,username'],
            'email' => ['nullable', 'email', 'max:100'],
            'idMahasiswa' => ['nullable', 'exists:mahasiswa,idMahasiswa'],
        ], [
            'username.required_unless' => 'Username wajib diisi untuk role non-mahasiswa.',
            'username.unique' => 'Username sudah dipakai.',
            'email.email' => 'Format alamat email tidak valid.',
        ]);

        if (($data['role'] ?? null) === 'mahasiswa') {
            $request->validate(['idMahasiswa' => ['required', 'exists:mahasiswa,idMahasiswa']], ['idMahasiswa.required' => 'Mahasiswa wajib dipilih.']);
            $mahasiswa = Mahasiswa::findOrFail($data['idMahasiswa']);
            if (User::where('username', $mahasiswa->nim)->orWhere('idMahasiswa', $mahasiswa->idMahasiswa)->exists()) {
                return back()->with('error', 'Mahasiswa tersebut sudah memiliki akun.')->withInput();
            }
            if (! empty($data['email'])) {
                $mahasiswa->email = $data['email'];
                $mahasiswa->save();
            }
            $user = $this->accounts->syncOne($mahasiswa, true);
            if (! empty($data['email'])) {
                $user->email = $data['email'];
                $user->save();
            }
            $plain = StudentAccountService::defaultPasswordForNim($mahasiswa->nim);
        } else {
            $plain = StudentAccountService::defaultPasswordForRole($data['role']);
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'] ?? null,
                'password' => Hash::make($plain),
                'role' => $data['role'],
                'status' => 'aktif',
            ]);
        }

        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Menambahkan user "'.$user->username.'" dengan role '.strtoupper($user->role)]);

        return redirect()->route('admin.user.index')->with('success', 'User berhasil ditambahkan. Password default: '.$plain);
    }

    public function edit(int $id): Response
    {
        $user = User::with('mahasiswa')->findOrFail($id);

        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'mahasiswa' => Mahasiswa::whereNotNull('nim')->where(fn ($q) => $q->whereDoesntHave('akun')->orWhere('idMahasiswa', $user->idMahasiswa))->orderBy('nama')->get(['idMahasiswa', 'nim', 'nama']),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'role' => ['required', 'string'],
            'username' => ['required_unless:role,mahasiswa', 'string', 'max:50', 'unique:user,username,'.$user->idUser.',idUser'],
            'email' => ['nullable', 'email', 'max:100'],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
            'idMahasiswa' => ['nullable', 'exists:mahasiswa,idMahasiswa'],
            'password' => ['nullable', 'string', 'min:8'],
        ], [
            'status.in' => 'Status harus aktif atau nonaktif.',
            'email.email' => 'Format alamat email tidak valid.',
        ]);

        if ($data['role'] === 'mahasiswa') {
            $request->validate(['idMahasiswa' => ['required', 'exists:mahasiswa,idMahasiswa']], ['idMahasiswa.required' => 'Mahasiswa wajib dipilih.']);
            $mahasiswa = Mahasiswa::findOrFail($data['idMahasiswa']);
            $duplikat = User::where('idUser', '!=', $user->idUser)->where(fn ($q) => $q->where('username', $mahasiswa->nim)->orWhere('idMahasiswa', $mahasiswa->idMahasiswa))->exists();
            if ($duplikat) {
                return back()->with('error', 'Mahasiswa tersebut sudah memiliki akun.')->withInput();
            }
            $user->username = $mahasiswa->nim;
            $user->idMahasiswa = $mahasiswa->idMahasiswa;
            if (! empty($data['email'])) {
                $mahasiswa->email = $data['email'];
                $mahasiswa->save();
            }
        } else {
            $user->username = $data['username'];
            $user->idMahasiswa = null;
        }

        if (array_key_exists('email', $data)) {
            $user->email = $data['email'];
        }
        $user->role = $data['role'];
        $user->status = $data['status'];
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Mengubah data user "'.$user->username.'"']);

        return redirect()->route('admin.user.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $username = $user->username;
        $user->delete();
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Menghapus user "'.$username.'"']);

        return redirect()->route('admin.user.index')->with('success', 'User berhasil dihapus.');
    }

    public function reset(Request $request, int $id): RedirectResponse
    {
        $user = User::with('mahasiswa')->findOrFail($id);
        $plain = $this->accounts->resetPassword($user);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Mereset password user "'.$user->username.'"']);

        return redirect()->route('admin.user.index')->with('success', 'Password berhasil direset menjadi: '.$plain);
    }

    public function syncMahasiswa(Request $request): RedirectResponse
    {
        $result = $this->accounts->syncMissing(true);
        Aktivitas::create(['user_id' => $request->user()->idUser, 'aktivitas' => 'Sinkronisasi dan reset password akun mahasiswa: '.$result['created'].' dibuat, '.$result['updated'].' diperbarui']);

        return redirect()->route('admin.user.index')->with('success', 'Sinkronisasi selesai. Dibuat: '.$result['created'].', diperbarui/reset: '.$result['updated'].', dilewati: '.$result['skipped'].'.');
    }

    public function resetRequests(): Response
    {
        $requests = PasswordResetRequest::with(['user.mahasiswa', 'approver'])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Admin/User/ResetRequests', [
            'requests' => $requests,
            'pendingCount' => PasswordResetRequest::where('status', 'pending')->count(),
        ]);
    }

    public function approveResetRequest(Request $request, int $id): RedirectResponse
    {
        $resetReq = PasswordResetRequest::findOrFail($id);
        if ($resetReq->status !== 'pending') {
            return back()->with('error', 'Permohonan ini sudah diproses sebelumnya.');
        }

        $token = Str::random(48);
        $resetReq->status = 'approved';
        $resetReq->token = $token;
        $resetReq->approved_by = $request->user()->idUser;
        $resetReq->approved_at = now();
        $resetReq->expires_at = now()->addHours(24);
        $resetReq->admin_notes = $request->input('admin_notes', 'Disetujui oleh Admin.');
        $resetReq->save();

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Menyetujui (ACC) reset password akun "'.$resetReq->username.'"',
        ]);

        $resetUrl = url('/reset-password/'.$token);

        return back()->with('success', 'Permohonan reset password disetujui. Tautan reset: '.$resetUrl);
    }

    public function rejectResetRequest(Request $request, int $id): RedirectResponse
    {
        $resetReq = PasswordResetRequest::findOrFail($id);
        if ($resetReq->status !== 'pending') {
            return back()->with('error', 'Permohonan ini sudah diproses sebelumnya.');
        }

        $resetReq->status = 'rejected';
        $resetReq->admin_notes = $request->input('admin_notes', 'Ditolak oleh Admin.');
        $resetReq->save();

        Aktivitas::create([
            'user_id' => $request->user()->idUser,
            'aktivitas' => 'Menolak permohonan reset password akun "'.$resetReq->username.'"',
        ]);

        return back()->with('success', 'Permohonan reset password ditolak.');
    }

    public function updateMyPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Kata sandi saat ini wajib diisi.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Kata sandi saat ini tidak cocok.']);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        Aktivitas::create([
            'user_id' => $user->idUser,
            'aktivitas' => strtoupper($user->role).' mengubah kata sandi mandiri',
        ]);

        return back()->with('success', 'Kata sandi Anda berhasil diperbarui.');
    }
}
