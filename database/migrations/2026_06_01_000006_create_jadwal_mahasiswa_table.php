<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_mahasiswa', function (Blueprint $table) {
            $table->increments('idJadwal');
            $table->unsignedInteger('idMahasiswa')->nullable();
            $table->integer('semester')->nullable();
            $table->string('judul_jadwal', 150)->nullable();
            $table->string('file_jadwal', 255)->nullable();
            $table->string('nama_file', 255)->nullable();
            $table->string('tipe_file', 50)->nullable();
            $table->unsignedInteger('ukuran_file')->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();

            $table->unique(['idMahasiswa', 'semester'], 'uniq_jadwal_mahasiswa_semester');

            $table->foreign('idMahasiswa', 'fk_jadwal_mahasiswa_mahasiswa')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_mahasiswa');
    }
};
