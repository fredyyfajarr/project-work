<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('mahasiswa_id');
            $table->string('semester', 50);
            $table->decimal('ips', 3, 2);
            $table->decimal('ipk', 3, 2);
            $table->timestamps();

            $table->unique(['mahasiswa_id', 'semester'], 'nilai_mahasiswa_semester_unique');

            $table->foreign('mahasiswa_id', 'fk_nilai_mahasiswa')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
