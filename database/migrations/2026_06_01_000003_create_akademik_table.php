<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('akademik', function (Blueprint $table) {
            $table->increments('idAkademik');
            $table->unsignedInteger('idMahasiswa')->nullable();
            $table->integer('semester')->nullable();
            $table->decimal('ips', 3, 2)->nullable();
            $table->decimal('ipk', 3, 2)->nullable();
            // TANPA timestamps (sesuai SQL lama)

            $table->foreign('idMahasiswa', 'akademik_ibfk_1')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('akademik');
    }
};
