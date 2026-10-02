<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicituds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->foreignId('lugar_pasantia_id')->constrained('lugar_pasantias')->onDelete('cascade');
            $table->enum('estado', ['pendiente', 'aceptada', 'rechazada'])->default('pendiente');
            $table->text('comentarios')->nullable(); // Para mensajes de rechazo o detalles
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicituds');
    }
};
