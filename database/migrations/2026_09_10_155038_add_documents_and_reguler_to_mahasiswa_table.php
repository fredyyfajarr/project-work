<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->string('jenisReguler', 50)->nullable()->after('jalurMasuk');
            $table->string('fileKtp')->nullable()->after('alamat');
            $table->string('fileKk')->nullable()->after('fileKtp');
            $table->string('fileSuratKerja')->nullable()->after('fileKk');
            $table->string('fotoProfil')->nullable()->after('fileSuratKerja');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropColumn(['jenisReguler', 'fileKtp', 'fileKk', 'fileSuratKerja', 'fotoProfil']);
        });
    }
};
