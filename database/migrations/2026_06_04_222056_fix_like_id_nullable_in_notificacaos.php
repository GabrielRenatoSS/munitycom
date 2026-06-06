<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notificacaos', function (Blueprint $table) {
            $table->unsignedBigInteger('like_id')->nullable()->change();
            $table->unsignedBigInteger('comentario_id')->nullable()->change();
            $table->unsignedBigInteger('follower_id')->nullable()->change();
            $table->unsignedBigInteger('spotted_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notificacaos', function (Blueprint $table) {
            //
        });
    }
};
