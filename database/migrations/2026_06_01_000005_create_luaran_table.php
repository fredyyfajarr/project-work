<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('luaran', function (Blueprint $table) {
            $table->increments('idLuaran');
            $table->unsignedInteger('idMahasiswa')->nullable();
            $table->string('judul', 150)->nullable();
            $table->string('jenisLuaran', 100)->nullable();
            $table->string('tingkat', 50)->nullable();
            $table->integer('tahun')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('fileBukti', 255)->nullable();
            $table->enum('status', ['pending', 'diterima', 'ditolak'])->default('pending');
            $table->timestamps();

            $table->foreign('idMahasiswa', 'luaran_ibfk_1')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('luaran');
    }
};
