<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nomorsurat', function (Blueprint $table) {
            $table->increments('idSurat');
            $table->string('jenisSurat', 100)->nullable();
            $table->string('nomorSurat', 100)->nullable()->unique();
            $table->string('nomorUrut', 10)->nullable();
            $table->string('kodePejabat', 20)->nullable();
            $table->string('kodePerihal', 20)->nullable();
            $table->text('perihal')->nullable();
            $table->string('tujuanSurat', 255)->nullable();
            $table->date('tanggalSurat')->nullable();
            $table->string('bulanRomawi', 10)->nullable();
            $table->year('tahun')->nullable();
            $table->string('penandatangan', 255)->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status', ['draft', 'diajukan', 'disetujui'])->nullable();
            $table->unsignedInteger('idUser')->nullable();
            $table->timestamps();

            $table->foreign('idUser', 'fk_nomorsurat_user')
                ->references('idUser')->on('user')
                ->cascadeOnUpdate()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nomorsurat');
    }
};
