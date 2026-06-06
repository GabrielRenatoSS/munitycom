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
        Schema::create('notificacaos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('like_id')->constrained('likes')->onDelete('cascade')->nullable();
            $table->foreignId('comentario_id')->constrained('comentarios')->onDelete('cascade')->nullable();
            $table->foreignId('follower_id')->constrained('followers')->onDelete('cascade')->nullable();
            $table->foreignId('spotted_id')->constrained('spotteds')->onDelete('cascade')->nullable();
            $table->integer('tipo'); //0: like, 1: comentario, 2: seguidor, 3: spotted, 4: progresso
            $table->boolean('leitura'); //0: não lido, 1: lido
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificacaos');
    }
};
