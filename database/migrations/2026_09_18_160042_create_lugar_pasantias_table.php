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
        Schema::create('lugar_pasantias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_empresa');
            $table->string('direccion');
            $table->string('contacto_nombre');
            $table->string('contacto_telefono');
            $table->string('contacto_email')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lugar_pasantias');
    }
};
