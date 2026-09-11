<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('user', 'email')) {
            Schema::table('user', function (Blueprint $table) {
                $table->string('email', 100)->nullable()->after('username');
            });
        }

        // Isi email default untuk akun internal yang sudah ada
        DB::table('user')->where('username', 'admin')->whereNull('email')->update(['email' => 'admin.lld@unpam.ac.id']);
        DB::table('user')->where('username', 'ketua')->whereNull('email')->update(['email' => 'ketua.lld@unpam.ac.id']);
        DB::table('user')->where('username', 'staff_viktor')->whereNull('email')->update(['email' => 'staff.viktor@unpam.ac.id']);
        DB::table('user')->where('username', 'staff_serang')->whereNull('email')->update(['email' => 'staff.serang@unpam.ac.id']);

        // Sinkronkan email akun mahasiswa dari tabel mahasiswa jika ada
        if (Schema::hasTable('mahasiswa') && Schema::hasColumn('user', 'idMahasiswa')) {
            $mahasiswaEmails = DB::table('mahasiswa')
                ->whereNotNull('email')
                ->where('email', '!=', '')
                ->pluck('email', 'idMahasiswa');

            foreach ($mahasiswaEmails as $idMhs => $email) {
                DB::table('user')
                    ->where('idMahasiswa', $idMhs)
                    ->whereNull('email')
                    ->update(['email' => $email]);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('user', 'email')) {
            Schema::table('user', function (Blueprint $table) {
                $table->dropColumn('email');
            });
        }
    }
};
