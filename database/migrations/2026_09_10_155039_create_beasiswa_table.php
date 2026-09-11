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
        Schema::create('beasiswa', function (Blueprint $table) {
            $table->id('idBeasiswa');
            $table->unsignedInteger('idMahasiswa');
            $table->string('nikKtp', 30)->nullable();
            $table->string('namaBank', 100);
            $table->string('noRekening', 50);
            $table->string('atasNama', 150);
            $table->string('fileBukuTabungan')->nullable();
            $table->string('jenisBeasiswa', 100)->default('Beasiswa Disabilitas');
            $table->string('status', 50)->default('Menunggu Verifikasi');
            $table->text('catatan')->nullable();
            $table->string('periode', 50)->nullable();
            $table->timestamps();

            $table->foreign('idMahasiswa')
                ->references('idMahasiswa')
                ->on('mahasiswa')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beasiswa');
    }
};
