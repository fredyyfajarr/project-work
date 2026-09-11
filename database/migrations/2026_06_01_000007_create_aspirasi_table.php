<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aspirasi', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('mahasiswa_id')->nullable();
            $table->string('subjek', 200);
            $table->string('kategori', 80);
            $table->text('pesan');
            $table->string('tanggal', 50);
            $table->string('status', 30)->default('Dikirim');
            $table->timestamps();

            $table->foreign('mahasiswa_id', 'fk_aspirasi_mahasiswa')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aspirasi');
    }
};
