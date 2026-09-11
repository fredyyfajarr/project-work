<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aktivitas', function (Blueprint $table) {
            $table->id();
            // INT (bukan BIGINT) agar FK ke user.idUser (INT) valid di MySQL.
            $table->unsignedInteger('user_id');
            $table->string('aktivitas', 255);
            $table->timestamps();

            $table->foreign('user_id', 'fk_aktivitas_user')
                ->references('idUser')->on('user')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aktivitas');
    }
};
