<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('keluarga', function (Blueprint $table) {
            $table->increments('idKeluarga');
            $table->unsignedInteger('idMahasiswa')->nullable();
            $table->string('namaAyah', 100)->nullable();
            $table->string('namaIbu', 100)->nullable();
            $table->string('pekerjaanAyah', 100)->nullable();
            $table->string('pekerjaanIbu', 100)->nullable();
            $table->string('noHpAyah', 15)->nullable();
            $table->string('noHpIbu', 15)->nullable();
            // TANPA timestamps (sesuai SQL lama)

            $table->foreign('idMahasiswa', 'keluarga_ibfk_1')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keluarga');
    }
};
