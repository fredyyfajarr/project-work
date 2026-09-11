<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms', function (Blueprint $table) {
            $table->increments('idCms');
            $table->string('slug', 150)->unique('cms_slug_unique');
            $table->string('menu_slug', 100)->index('cms_menu_slug_index');
            $table->string('kategori', 50)->index('cms_kategori_index');
            $table->string('nama_menu', 150);
            $table->string('judul', 150);
            $table->text('deskripsi')->nullable();
            $table->string('gambar', 255)->nullable();
            $table->string('link_berita', 255)->nullable();
            $table->integer('urutan')->default(1);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->dateTime('tanggalUpdate')->nullable()->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms');
    }
};
