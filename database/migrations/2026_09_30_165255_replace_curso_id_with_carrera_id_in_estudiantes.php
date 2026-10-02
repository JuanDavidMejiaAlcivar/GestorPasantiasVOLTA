<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('estudiantes', function (Blueprint $table) {
            // Eliminar la FK a cursos
            $table->dropForeign(['curso_id']);
            $table->dropColumn('curso_id');

            // Añadir FK directa a carreras
            $table->foreignId('carrera_id')
                  ->after('user_id')
                  ->constrained('carreras')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('estudiantes', function (Blueprint $table) {
            $table->dropForeign(['carrera_id']);
            $table->dropColumn('carrera_id');

            $table->foreignId('curso_id')
                  ->after('user_id')
                  ->constrained('cursos')
                  ->onDelete('cascade');
        });
    }
};
