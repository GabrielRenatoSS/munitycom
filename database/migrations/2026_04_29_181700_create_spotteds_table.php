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
        Schema::create('spotteds', function (Blueprint $table) {
            $table->id();
            $table->boolean('tipo'); //0 é publico, 1 é privado
            $table->boolean('anonimo'); //0 é normal, 1 é anônimo
            $table->string('mensagem');
            $table->foreignId('remetente_id')->constrained('membro_comites')->onDelete('cascade');
            $table->foreignId('destinatario_id')->constrained('membro_comites')->onDelete('cascade');
            $table->foreignId('comite_id')->constrained('comites')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spotteds');
    }
};
