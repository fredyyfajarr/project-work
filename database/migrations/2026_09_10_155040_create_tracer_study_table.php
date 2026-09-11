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
        Schema::create('tracer_study', function (Blueprint $table) {
            $table->id('idTracer');
            $table->unsignedInteger('idMahasiswa');
            $table->string('statusPekerjaan', 50)->default('Belum Bekerja');
            $table->string('namaInstansi', 150)->nullable();
            $table->string('jabatan', 100)->nullable();
            $table->string('bidangPekerjaan', 100)->nullable();
            $table->string('jenisPekerjaan', 100)->nullable();
            $table->string('lokasiPekerjaan', 150)->nullable();
            $table->integer('tahunMulai')->nullable();
            $table->integer('masaTungguBulan')->nullable();
            $table->string('kesesuaianBidang', 50)->nullable();
            $table->string('pendapatanBulanan', 50)->nullable();
            $table->string('namaUniversitasLanjut', 150)->nullable();
            $table->string('prodiLanjut', 100)->nullable();
            $table->text('saranLayanan')->nullable();
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
        Schema::dropIfExists('tracer_study');
    }
};
