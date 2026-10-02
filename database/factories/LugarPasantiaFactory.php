<?php

namespace Database\Factories;

use App\Models\LugarPasantia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LugarPasantia>
 */
class LugarPasantiaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre_empresa' => fake()->company(),
            'direccion' => fake()->address(),
            'contacto_nombre' => fake()->name(),
            'contacto_telefono' => fake()->numerify('09########'),
            'contacto_email' => fake()->unique()->safeEmail(),
        ];
    }
}
