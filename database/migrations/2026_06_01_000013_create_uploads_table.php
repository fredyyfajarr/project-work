<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uploads', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('mahasiswa_id')->nullable();
            $table->string('original_name', 255);
            $table->string('file_name', 255);
            $table->text('file_path');
            $table->string('mime_type', 120)->nullable();
            $table->integer('size_bytes')->default(0);
            $table->timestamps();

            $table->foreign('mahasiswa_id', 'fk_uploads_mahasiswa')
                ->references('idMahasiswa')->on('mahasiswa')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uploads');
    }
};
