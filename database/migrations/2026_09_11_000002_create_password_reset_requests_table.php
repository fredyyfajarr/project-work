<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('password_reset_requests')) {
            Schema::create('password_reset_requests', function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedInteger('user_id');
                $table->string('username', 50);
                $table->string('email', 100);
                $table->string('token', 100)->nullable()->unique();
                $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
                $table->text('admin_notes')->nullable();
                $table->unsignedInteger('approved_by')->nullable();
                $table->timestamp('approved_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();

                $table->foreign('user_id', 'fk_prr_user')
                    ->references('idUser')->on('user')
                    ->cascadeOnDelete()->cascadeOnUpdate();

                $table->foreign('approved_by', 'fk_prr_admin')
                    ->references('idUser')->on('user')
                    ->nullOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_requests');
    }
};
