<?php

namespace Tests\Feature;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RbacSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_access_admin_routes_and_receives_403(): void
    {
        $mhs = Mahasiswa::create([
            'nim' => '231011400001',
            'nama' => 'Siswa Disabilitas Test',
            'jurusan' => 'Teknik Informatika',
            'status' => 'aktif',
        ]);

        $userMhs = User::create([
            'username' => '231011400001',
            'email' => 'mhs@unpam.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'mahasiswa',
            'idMahasiswa' => $mhs->idMahasiswa,
            'status' => 'aktif',
        ]);

        // Percobaan akses direct URL admin oleh mahasiswa harus ditolak 403
        $response = $this->actingAs($userMhs)->get('/admin');
        $response->assertStatus(403);

        $responseUser = $this->actingAs($userMhs)->get('/admin/user');
        $responseUser->assertStatus(403);

        $responseMahasiswa = $this->actingAs($userMhs)->get('/admin/mahasiswa');
        $responseMahasiswa->assertStatus(403);
    }

    public function test_student_can_access_own_portal_routes(): void
    {
        $mhs = Mahasiswa::create([
            'nim' => '231011400002',
            'nama' => 'Siswa Inklusi 2',
            'jurusan' => 'Sistem Informasi',
            'status' => 'aktif',
        ]);

        $userMhs = User::create([
            'username' => '231011400002',
            'email' => 'mhs2@unpam.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'mahasiswa',
            'idMahasiswa' => $mhs->idMahasiswa,
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($userMhs)->get('/mahasiswa');
        $response->assertStatus(200);

        $responseAspirasi = $this->actingAs($userMhs)->get('/mahasiswa/aspirasi');
        $responseAspirasi->assertStatus(200);
    }

    public function test_admin_cannot_access_mahasiswa_portal_routes(): void
    {
        $admin = User::create([
            'username' => 'superadmin',
            'email' => 'admin@unpam.ac.id',
            'password' => Hash::make('admin12345'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        // Admin diblokir jika mencoba akses portal khusus mahasiswa
        $response = $this->actingAs($admin)->get('/mahasiswa');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_monitoring_jadwal_kepatuhan(): void
    {
        $admin = User::create([
            'username' => 'superadmin2',
            'email' => 'admin2@unpam.ac.id',
            'password' => Hash::make('admin12345'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($admin)->get('/admin/monitoring-jadwal?tab=kepatuhan');
        $response->assertStatus(200);
    }

    public function test_admin_can_download_cetak_biodata_pdf(): void
    {
        $admin = User::create([
            'username' => 'superadmin3',
            'email' => 'admin3@unpam.ac.id',
            'password' => Hash::make('admin12345'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $mhs = Mahasiswa::create([
            'nim' => '231011400003',
            'nama' => 'Mahasiswa Cetak Test',
            'jurusan' => 'Ilmu Hukum',
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($admin)->get("/admin/mahasiswa/{$mhs->idMahasiswa}/cetak-biodata");
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }
}
