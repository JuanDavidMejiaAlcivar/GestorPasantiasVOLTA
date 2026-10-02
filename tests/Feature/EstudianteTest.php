<?php

namespace Tests\Feature;

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class EstudianteTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'cedula' => '12345678',
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'correo' => 'juan.perez@estudiante.test',
            'curso_id' => Curso::factory()->create()->id,
        ], $overrides);
    }

    public function test_admin_can_view_the_list(): void
    {
        $this->actingAs($this->admin());
        Estudiante::factory()->create();

        $this->get(route('estudiantes.index'))->assertOk();
    }

    public function test_admin_can_open_the_create_form(): void
    {
        $this->actingAs($this->admin());
        Curso::factory()->create();

        $this->get(route('estudiantes.create'))->assertOk();
    }

    public function test_admin_can_open_the_edit_form(): void
    {
        $this->actingAs($this->admin());
        $estudiante = Estudiante::factory()->create();

        $this->get(route('estudiantes.edit', $estudiante))->assertOk();
    }

    public function test_admin_can_create_a_student_with_a_login_account(): void
    {
        $this->actingAs($this->admin());

        $response = $this->post(route('estudiantes.store'), $this->payload());

        $response->assertRedirect(route('estudiantes.index'));
        $response->assertSessionHasNoErrors();

        $estudiante = Estudiante::first();
        $this->assertNotNull($estudiante);
        $this->assertSame('12345678', $estudiante->cedula);
        $this->assertNotNull($estudiante->user_id);

        // The default password is the cedula, and it must actually verify.
        $this->assertTrue(
            Hash::check('12345678', $estudiante->user->password),
            'El password por defecto deberia ser la cedula y verificar correctamente.'
        );
    }

    public function test_admin_can_create_a_student_without_a_login_account(): void
    {
        $this->actingAs($this->admin());

        $response = $this->post(route('estudiantes.store'), $this->payload(['correo' => '']));

        $response->assertRedirect(route('estudiantes.index'));
        $response->assertSessionHasNoErrors();

        $estudiante = Estudiante::first();
        $this->assertNotNull($estudiante);
        $this->assertNull($estudiante->user_id);
        $this->assertNull($estudiante->correo);
    }

    public function test_store_rejects_invalid_data(): void
    {
        $this->actingAs($this->admin());

        $this->post(route('estudiantes.store'), [
            'cedula' => '',
            'nombres' => '',
            'apellidos' => '',
            'correo' => 'no-es-un-correo',
            'curso_id' => 99999,
        ])->assertSessionHasErrors(['cedula', 'nombres', 'apellidos', 'correo', 'curso_id']);

        $this->assertSame(0, Estudiante::count());
        $this->assertSame(0, User::where('role', 'estudiante')->count());
    }

    public function test_store_rejects_a_duplicate_cedula_without_creating_an_orphan_user(): void
    {
        $this->actingAs($this->admin());
        Estudiante::factory()->create(['cedula' => '12345678']);

        $this->post(route('estudiantes.store'), $this->payload(['correo' => 'otro@estudiante.test']))
            ->assertSessionHasErrors('cedula');

        $this->assertSame(1, Estudiante::count());
        $this->assertSame(0, User::where('email', 'otro@estudiante.test')->count());
    }

    public function test_store_rejects_a_correo_already_used_by_another_account(): void
    {
        $this->actingAs($this->admin());
        User::factory()->create(['email' => 'ocupado@estudiante.test']);

        $this->post(route('estudiantes.store'), $this->payload(['correo' => 'ocupado@estudiante.test']))
            ->assertSessionHasErrors('correo');

        $this->assertSame(0, Estudiante::count());
    }

    public function test_admin_can_update_a_student(): void
    {
        $this->actingAs($this->admin());
        $estudiante = Estudiante::factory()->create([
            'cedula' => '11111111',
            'nombres' => 'Ana',
            'apellidos' => 'Gomez',
        ]);

        $response = $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => '22222222',
            'nombres' => 'Ana Maria',
            'apellidos' => 'Gomez Diaz',
            'correo' => 'ana.gomez@estudiante.test',
            'curso_id' => $estudiante->curso_id,
        ]);

        $response->assertRedirect(route('estudiantes.index'));
        $response->assertSessionHasNoErrors();

        $estudiante->refresh();
        $this->assertSame('22222222', $estudiante->cedula);
        $this->assertSame('Ana Maria', $estudiante->nombres);
    }

    public function test_update_keeps_the_own_cedula_valid(): void
    {
        $this->actingAs($this->admin());
        $estudiante = Estudiante::factory()->create(['cedula' => '12345678']);

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => '12345678',
            'nombres' => 'Juan',
            'apellidos' => 'Perez Dos',
            'correo' => 'juan.perez@estudiante.test',
            'curso_id' => $estudiante->curso_id,
        ])->assertSessionHasNoErrors();
    }

    public function test_update_rejects_a_cedula_taken_by_another_student(): void
    {
        $this->actingAs($this->admin());
        $otro = Estudiante::factory()->create(['cedula' => '99999999']);
        $estudiante = Estudiante::factory()->create(['cedula' => '11111111']);

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => '99999999',
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'correo' => 'juan@estudiante.test',
            'curso_id' => $estudiante->curso_id,
        ])->assertSessionHasErrors('cedula');

        $this->assertSame('11111111', $estudiante->fresh()->cedula);
        $this->assertNotSame($otro->cedula, $estudiante->fresh()->cedula);
    }

    public function test_update_creates_the_login_account_when_a_correo_is_added_later(): void
    {
        $this->actingAs($this->admin());
        $estudiante = Estudiante::factory()->sinCorreo()->create();

        $this->assertNull($estudiante->user_id);

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => $estudiante->cedula,
            'nombres' => $estudiante->nombres,
            'apellidos' => $estudiante->apellidos,
            'correo' => 'nuevo@estudiante.test',
            'curso_id' => $estudiante->curso_id,
        ])->assertSessionHasNoErrors();

        $estudiante->refresh();
        $this->assertNotNull($estudiante->user_id, 'Deberia crearse la cuenta al agregar un correo.');
        $this->assertSame('nuevo@estudiante.test', $estudiante->user->email);
        $this->assertTrue(Hash::check($estudiante->cedula, $estudiante->user->password));
    }

    public function test_update_keeps_the_login_account_in_sync(): void
    {
        $this->actingAs($this->admin());
        $user = User::factory()->create(['email' => 'viejo@estudiante.test', 'name' => 'Nombre Viejo']);
        $estudiante = Estudiante::factory()->create([
            'user_id' => $user->id,
            'correo' => 'viejo@estudiante.test',
            'nombres' => 'Pedro',
            'apellidos' => 'Gomez',
        ]);

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => $estudiante->cedula,
            'nombres' => 'Pedro Luis',
            'apellidos' => 'Gomez Soto',
            'correo' => 'nuevo@estudiante.test',
            'curso_id' => $estudiante->curso_id,
        ])->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertSame('nuevo@estudiante.test', $user->email);
        $this->assertSame('Pedro Luis Gomez Soto', $user->name);
    }

    public function test_update_rejects_a_correo_used_by_another_account(): void
    {
        $this->actingAs($this->admin());
        User::factory()->create(['email' => 'ocupado@estudiante.test']);
        $estudiante = Estudiante::factory()->create();

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => $estudiante->cedula,
            'nombres' => $estudiante->nombres,
            'apellidos' => $estudiante->apellidos,
            'correo' => 'ocupado@estudiante.test',
            'curso_id' => $estudiante->curso_id,
        ])->assertSessionHasErrors('correo');
    }

    public function test_update_can_clear_the_correo_without_breaking_the_account(): void
    {
        $this->actingAs($this->admin());
        $user = User::factory()->create(['email' => 'antes@estudiante.test']);
        $estudiante = Estudiante::factory()->create([
            'user_id' => $user->id,
            'correo' => 'antes@estudiante.test',
        ]);

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => $estudiante->cedula,
            'nombres' => $estudiante->nombres,
            'apellidos' => $estudiante->apellidos,
            'correo' => '',
            'curso_id' => $estudiante->curso_id,
        ])->assertSessionHasNoErrors();

        $estudiante->refresh();
        $this->assertNull($estudiante->correo);
        $this->assertNotNull($user->fresh(), 'La cuenta de usuario no deberia eliminarse al quitar el correo.');
    }

    public function test_student_can_move_between_courses(): void
    {
        $this->actingAs($this->admin());
        $estudiante = Estudiante::factory()->create();
        $nuevoCurso = Curso::factory()->create();

        $this->put(route('estudiantes.update', $estudiante), [
            'cedula' => $estudiante->cedula,
            'nombres' => $estudiante->nombres,
            'apellidos' => $estudiante->apellidos,
            'correo' => $estudiante->correo,
            'curso_id' => $nuevoCurso->id,
        ])->assertSessionHasNoErrors();

        $this->assertSame($nuevoCurso->id, $estudiante->fresh()->curso_id);
    }

    public function test_non_admins_cannot_manage_students(): void
    {
        $estudianteUser = User::factory()->create(['role' => 'estudiante']);
        $this->actingAs($estudianteUser);

        $this->get(route('estudiantes.index'))->assertForbidden();
        $this->get(route('estudiantes.create'))->assertForbidden();
        $this->post(route('estudiantes.store'), $this->payload())->assertForbidden();
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('estudiantes.index'))->assertRedirect(route('login'));
    }
}
