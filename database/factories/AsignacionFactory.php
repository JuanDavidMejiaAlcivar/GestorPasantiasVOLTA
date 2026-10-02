<?php

namespace Database\Factories;

use App\Models\Asignacion;
use App\Models\Estudiante;
use App\Models\LugarPasantia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Asignacion>
 */
class AsignacionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'estudiante_id' => Estudiante::factory(),
            'lugar_pasantia_id' => LugarPasantia::factory(),
            'fecha_inicio' => now()->subMonth()->toDateString(),
            'fecha_fin' => now()->addMonth()->toDateString(),
            'estado' => 'en_curso',
        ];
    }
}
