<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->increments('idMahasiswa');
            $table->string('nim', 20)->nullable()->unique();
            $table->string('nama', 100)->nullable();
            $table->string('jurusan', 100)->nullable();
            $table->integer('angkatan')->nullable();
            $table->string('jalurMasuk', 100)->nullable();
            $table->string('nik', 20)->nullable();
            $table->string('jenisKelamin', 20)->nullable();
            $table->string('tempatLahir', 100)->nullable();
            $table->date('tanggalLahir')->nullable();
            $table->string('agama', 50)->nullable();
            $table->string('noHp', 15)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('alamat')->nullable();
            $table->string('jenisHambatan', 255)->nullable();
            $table->string('levelHambatan', 50)->nullable();
            $table->string('kemampuanMobilitas', 100)->nullable();
            $table->string('kemampuanBahasa', 100)->nullable();
            $table->string('disabilitas', 100)->nullable();
            $table->enum('status', ['aktif', 'nonaktif', 'cuti', 'lulus'])->default('aktif');
            // TANPA timestamps (sesuai SQL lama)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};
