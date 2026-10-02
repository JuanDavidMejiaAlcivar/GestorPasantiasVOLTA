<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Curso;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Curso>
 */
class CursoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->unique()->randomElement([
                ' primer',
                ' segundo',
                ' tercero',
                ' cuarto',
                ' quinto',
                ' sexto',
            ]).' '.fake()->randomElement(['A', 'B', 'C']),
            'carrera_id' => Carrera::factory(),
        ];
    }
}
