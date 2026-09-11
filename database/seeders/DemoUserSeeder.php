<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'idMahasiswa' => null,
                'status' => 'aktif',
            ]
        );
        $admin->assignRole('admin');

        $ketua = User::updateOrCreate(
            ['username' => 'ketua'],
            [
                'password' => Hash::make('password123'),
                'role' => 'ketua',
                'idMahasiswa' => null,
                'status' => 'aktif',
            ]
        );
        $ketua->assignRole('ketua');

        $staff = User::updateOrCreate(
            ['username' => 'staff'],
            [
                'password' => Hash::make('password123'),
                'role' => 'staff',
                'idMahasiswa' => null,
                'status' => 'aktif',
            ]
        );
        $staff->assignRole('staff');

        $mahasiswa = Mahasiswa::updateOrCreate(
            ['nim' => '240000000001'],
            [
                'nama' => 'Mahasiswa Contoh',
                'jurusan' => 'Teknik Informatika',
                'angkatan' => 2024,
                'jalurMasuk' => 'Mandiri',
                'jenisKelamin' => 'Laki-laki',
                'disabilitas' => 'Netra',
                'jenisHambatan' => 'Netra',
                'status' => 'aktif',
            ]
        );

        $akunMahasiswa = User::updateOrCreate(
            ['username' => '240000000001'],
            [
                'password' => Hash::make('password123'),
                'role' => 'mahasiswa',
                'idMahasiswa' => $mahasiswa->idMahasiswa,
                'status' => 'aktif',
            ]
        );
        $akunMahasiswa->assignRole('mahasiswa');
    }
}
