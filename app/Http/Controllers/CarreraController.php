<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CarreraController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('admin');

        $search = $request->input('search');

        $query = Carrera::query();

        if ($search) {
            $termino = trim(preg_replace('/\s+/', ' ', $search));
            $query->where('nombre', 'LIKE', "%{$termino}%");
        }

        $carreras = $query->orderBy('nombre')->get();
        return inertia('carreras/index', [
            'carreras' => $carreras,
            'filters'  => ['search' => $search]
        ]);
    }

    public function create()
    {
        Gate::authorize('admin');
        return inertia('carreras/create');
    }

    public function store(Request $request)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:carreras,nombre',
            'descripcion' => 'nullable|string',
        ]);

        Carrera::create($validated);

        return redirect()->route('carreras.index')
            ->with('success', 'Carrera creada exitosamente.');
    }

    public function show(Carrera $carrera)
    {
        Gate::authorize('admin');

        $carrera->load(['estudiantes' => function ($query) {
            $query->withCount('asignaciones');
        }]);

        return inertia('carreras/show', compact('carrera'));
    }

    public function edit(Carrera $carrera)
    {
        Gate::authorize('admin');
        return inertia('carreras/edit', compact('carrera'));
    }

    public function update(Request $request, Carrera $carrera)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:carreras,nombre,' . $carrera->id,
            'descripcion' => 'nullable|string',
        ]);

        $carrera->update($validated);

        return redirect()->route('carreras.index')
            ->with('success', 'Carrera actualizada exitosamente.');
    }

    public function destroy(Carrera $carrera)
    {
        Gate::authorize('admin');

        $carrera->delete();

        return redirect()->route('carreras.index')
            ->with('success', 'Carrera eliminada exitosamente.');
    }
}
