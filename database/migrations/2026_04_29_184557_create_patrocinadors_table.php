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
        Schema::create('patrocinadors', function (Blueprint $table) {
            $table->id();
            $table->foreign_id('delegado_id')->constrained('membro_comites')->onDelete('cascade');
            $table->foreign_id('documento_id')->constrained('documentos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patrocinadors');
    }
};
