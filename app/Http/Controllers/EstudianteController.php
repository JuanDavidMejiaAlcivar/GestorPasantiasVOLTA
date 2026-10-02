<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Estudiante;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class EstudianteController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('admin');

        $search = $request->input('search');

        $query = Estudiante::with('carrera')->withCount('asignaciones');

        if ($search) {
            $termino = trim(preg_replace('/\s+/', ' ', $search));
            $query->where(function ($q) use ($termino) {
                $q->where('nombres', 'LIKE', "%{$termino}%")
                  ->orWhere('apellidos', 'LIKE', "%{$termino}%")
                  ->orWhere('cedula', 'LIKE', "%{$termino}%");
            });
        }

        $estudiantes = $query->orderBy('nombres')->get();

        return inertia('estudiantes/index', [
            'estudiantes' => $estudiantes,
            'filters'     => ['search' => $search]
        ]);
    }

    public function create()
    {
        Gate::authorize('admin');

        $carreras = Carrera::orderBy('nombre')->get();

        return inertia('estudiantes/create', compact('carreras'));
    }

    public function store(Request $request)
    {
        Gate::authorize('admin');

        $validated = $request->validate($this->rules());

        $estudiante = DB::transaction(function () use ($validated) {
            $estudiante = Estudiante::create([
                'carrera_id' => $validated['carrera_id'],
                'cedula' => $validated['cedula'],
                'nombres' => $validated['nombres'],
                'apellidos' => $validated['apellidos'],
                'correo' => $validated['correo'],
            ]);

            if (!empty($validated['correo'])) {
                $this->syncUser($estudiante);
            }

            return $estudiante;
        });

        return redirect()->route('estudiantes.index')
            ->with('success', 'Estudiante registrado correctamente.');
    }

    public function show(Estudiante $estudiante)
    {
        Gate::authorize('admin');

        $estudiante->load('carrera', 'asignaciones.lugarPasantia');

        return inertia('estudiantes/show', compact('estudiante'));
    }

    public function edit(Estudiante $estudiante)
    {
        Gate::authorize('admin');

        $carreras = Carrera::orderBy('nombre')->get();

        return inertia('estudiantes/edit', compact('estudiante', 'carreras'));
    }

    public function update(Request $request, Estudiante $estudiante)
    {
        Gate::authorize('admin');

        $validated = $request->validate($this->rules($estudiante));

        DB::transaction(function () use ($request, $estudiante, $validated) {
            $cedulaAnterior = $estudiante->cedula;

            $estudiante->update([
                'carrera_id' => $validated['carrera_id'],
                'cedula' => $validated['cedula'],
                'nombres' => $validated['nombres'],
                'apellidos' => $validated['apellidos'],
                'correo' => $validated['correo'],
            ]);

            if ($estudiante->user_id && $cedulaAnterior !== $validated['cedula']) {
                $estudiante->user->update([
                    'password' => bcrypt($validated['cedula'])
                ]);
            }

            if (!empty($validated['correo'])) {
                $this->syncUser($estudiante);
            } elseif ($estudiante->user_id) {
                $estudiante->user->delete();
                $estudiante->update(['user_id' => null]);
            }
        });

        return redirect()->route('estudiantes.index')
            ->with('success', 'Estudiante actualizado correctamente.');
    }

    public function destroy(Estudiante $estudiante)
    {
        Gate::authorize('admin');

        DB::transaction(function () use ($estudiante) {
            if ($estudiante->user_id) {
                $estudiante->user->delete();
            }
            $estudiante->delete();
        });

        return redirect()->route('estudiantes.index')
            ->with('success', 'Estudiante eliminado correctamente.');
    }

    private function syncUser(Estudiante $estudiante): void
    {
        if ($estudiante->user_id) {
            $estudiante->user->update([
                'name' => $estudiante->nombres . ' ' . $estudiante->apellidos,
                'email' => $estudiante->correo,
            ]);
        } else {
            $user = clone User::create([
                'name' => $estudiante->nombres . ' ' . $estudiante->apellidos,
                'email' => $estudiante->correo,
                'password' => bcrypt($estudiante->cedula),
                'role' => 'estudiante',
            ]);
            $estudiante->update(['user_id' => $user->id]);
        }
    }

    private function rules(?Estudiante $estudiante = null): array
    {
        return [
            'cedula' => [
                'required',
                'string',
                'max:20',
                Rule::unique('estudiantes')->ignore($estudiante?->id),
            ],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'correo' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($estudiante?->user_id)
                    ->where(fn ($query) => $query->whereNull('deleted_at')),
            ],
            'carrera_id' => ['required', 'integer', 'exists:carreras,id'],
        ];
    }
}
