<?php

namespace Database\Factories;

use App\Models\Curso;
use App\Models\Estudiante;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Estudiante>
 */
class EstudianteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'curso_id' => Curso::factory(),
            'cedula' => (string) fake()->unique()->numberBetween(10_000_000, 99_999_999),
            'nombres' => fake()->firstName(),
            'apellidos' => fake()->lastName(),
            'correo' => Str::lower(fake()->unique()->firstName().'.'.fake()->unique()->lastName()).'@estudiante.test',
        ];
    }

    /**
     * Indicate that the student has no associated user account.
     */
    public function sinCorreo(): static
    {
        return $this->state(fn (array $attributes) => [
            'correo' => null,
        ]);
    }
}
