<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LegacyDataSeeder extends Seeder
{
    public function run(): void
    {
        $file = 'C:/project/PROJECT_WORK_BEFORE/lld_project_work.sql';
        $sql = file_get_contents($file);

        $allowed = [
            'mahasiswa', 'user', 'akademik', 'keluarga', 'luaran',
            'jadwal_mahasiswa', 'aspirasi', 'cms', 'nomorsurat',
            'aktivitas', 'import_logs',
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Ambil semua statement INSERT langsung (abaikan komentar di sekitarnya)
        preg_match_all('/INSERT INTO `(\w+)`.*?;/s', $sql, $matches, PREG_SET_ORDER);
        $counts = [];
        foreach ($matches as $m) {
            $table = $m[1];
            if (! in_array($table, $allowed, true)) {
                continue;
            }
            $stmt = preg_replace('/^INSERT INTO/i', 'INSERT IGNORE INTO', $m[0]);
            DB::unprepared($stmt);
            $counts[$table] = ($counts[$table] ?? 0) + 1;
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        foreach ($counts as $table => $n) {
            $total = DB::table($table)->count();
            $this->command->info("{$table}: {$n} statement, total rows now {$total}");
        }

        // Sinkron spatie roles dari kolom user.role
        $users = DB::table('user')->get();
        foreach ($users as $u) {
            $role = DB::table('roles')->where('name', $u->role)->first();
            if (! $role) {
                continue;
            }
            $exists = DB::table('model_has_roles')
                ->where('role_id', $role->id)
                ->where('model_type', 'App\\Models\\User')
                ->where('model_id', $u->idUser)
                ->exists();
            if (! $exists) {
                DB::table('model_has_roles')->insert([
                    'role_id' => $role->id,
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $u->idUser,
                ]);
            }
        }
        // Standarisasi username non-mahasiswa dan pembersihan whitespace
        DB::table('user')->where('username', 'Kepala Lembaga')->update(['username' => 'ketua']);
        DB::table('user')->where('username', 'Kabid Viktor')->update(['username' => 'staff_viktor']);
        DB::table('user')->where('username', 'Kabid Serang')->update(['username' => 'staff_serang']);
        
        $allUsers = DB::table('user')->get();
        foreach ($allUsers as $u) {
            $clean = trim(preg_replace('/^[\s\x{00a0}\x{200b}]+|[\s\x{00a0}\x{200b}]+$/u', '', (string) $u->username));
            if ($clean !== $u->username) {
                DB::table('user')->where('idUser', $u->idUser)->update(['username' => $clean]);
            }
        }

        $this->command->info('Roles synced: '.DB::table('model_has_roles')->count().' assignments');
    }
}
