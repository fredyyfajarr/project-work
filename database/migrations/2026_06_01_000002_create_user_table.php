<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->increments('idUser');
            $table->string('username', 50)->nullable()->unique();
            $table->string('password', 255)->nullable();
            $table->enum('role', ['admin', 'ketua', 'staff', 'staff_serang', 'mahasiswa'])->nullable();
            $table->unsignedInteger('idMahasiswa')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            // TANPA timestamps (sesuai SQL lama)

            $table->foreign('idMahasiswa', 'user_ibfk_1')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
