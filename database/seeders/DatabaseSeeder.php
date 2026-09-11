<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            LegacyDataSeeder::class,
        ]);
        // Opsional demo (idempotent via updateOrCreate, tapi menimpa
        // password admin legacy jadi password123):
        // CmsSeeder::class, DemoUserSeeder::class,
    }
}
