<?php

namespace App\Http\Controllers;

use App\Models\LugarPasantia;
use App\Models\Carrera;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class LugarPasantiaController extends Controller
{
    // Helper para buscar ignorando acentos de manera rudimentaria pero compatible
    private function normalizarBusqueda($query, $campo, $termino)
    {
        // En SQLite y MySQL (con colación unicode) LIKE ya es case-insensitive.
        // Reemplazar espacios múltiples
        $termino = trim(preg_replace('/\s+/', ' ', $termino));
        
        $query->where($campo, 'LIKE', '%' . $termino . '%');
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $user = $request->user();

        $query = LugarPasantia::withCount('asignaciones')->with('carreras_preferenciales');

        if ($search) {
            $termino = trim(preg_replace('/\s+/', ' ', $search));
            
            $query->where(function($q) use ($termino) {
                $q->where('nombre_empresa', 'LIKE', "%{$termino}%")
                  ->orWhereHas('carreras_preferenciales', function($qCarrera) use ($termino) {
                      $qCarrera->where('nombre', 'LIKE', "%{$termino}%");
                  });
            });
        }

        $lugares = $query->orderBy('nombre_empresa')->get();
        
        $miPasantiaId = null;
        if ($user && $user->isEstudiante()) {
            $estudianteId = $user->estudiante?->id;
            if ($estudianteId) {
                $asignacion = \App\Models\Asignacion::where('estudiante_id', $estudianteId)
                    ->whereIn('estado', ['pendiente', 'en_curso'])
                    ->first();
                if ($asignacion) {
                    $miPasantiaId = $asignacion->lugar_pasantia_id;
                }
            }
        }

        return inertia('pasantias/lugares/index', [
            'lugares' => $lugares,
            'filters' => ['search' => $search],
            'userRole' => $user ? $user->role : 'user',
            'miPasantiaId' => $miPasantiaId
        ]);
    }

    public function create()
    {
        Gate::authorize('admin');
        $carreras = Carrera::orderBy('nombre')->get();
        return inertia('pasantias/lugares/create', compact('carreras'));
    }

    public function store(Request $request)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'nombre_empresa'    => 'required|string|max:255',
            'direccion'         => 'required|string|max:255',
            'contacto_nombre'   => 'required|string|max:255',
            'contacto_telefono' => 'required|string|max:255',
            'contacto_email'    => 'nullable|email|max:255',
            'cupos'             => 'required|integer|min:0',
            'carreras'          => 'nullable|array',
            'carreras.*'        => 'exists:carreras,id'
        ]);

        $lugar = LugarPasantia::create($validated);
        
        if (isset($validated['carreras'])) {
            $lugar->carreras_preferenciales()->sync($validated['carreras']);
        }

        return redirect()->route('lugares.index')
            ->with('success', 'Lugar de pasantía registrado exitosamente.');
    }

    public function show(Request $request, LugarPasantia $lugare)
    {
        $lugar = $lugare->load(['asignaciones.estudiante.carrera', 'carreras_preferenciales']);
        
        // Estudiantes que no tienen asignación (solo visible para admins, pero lo mandamos siempre por ahora o lo validamos)
        $estudiantesDisponibles = [];
        if ($request->user()->isAdmin()) {
            $estudiantesDisponibles = Estudiante::with('carrera')
                ->doesntHave('asignaciones')
                ->orderBy('nombres')
                ->get();
        }
        
        return inertia('pasantias/lugares/show', [
            'lugar' => $lugar,
            'estudiantesDisponibles' => $estudiantesDisponibles,
            'userRole' => $request->user()->role
        ]);
    }

    public function edit(LugarPasantia $lugare)
    {
        Gate::authorize('admin');
        $lugar = $lugare->load('carreras_preferenciales');
        $carreras = Carrera::orderBy('nombre')->get();
        
        return inertia('pasantias/lugares/edit', compact('lugar', 'carreras'));
    }

    public function update(Request $request, LugarPasantia $lugare)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'nombre_empresa'    => 'required|string|max:255',
            'direccion'         => 'required|string|max:255',
            'contacto_nombre'   => 'required|string|max:255',
            'contacto_telefono' => 'required|string|max:255',
            'contacto_email'    => 'nullable|email|max:255',
            'cupos'             => 'required|integer|min:0',
            'carreras'          => 'nullable|array',
            'carreras.*'        => 'exists:carreras,id'
        ]);

        $lugare->update($validated);

        if (isset($validated['carreras'])) {
            $lugare->carreras_preferenciales()->sync($validated['carreras']);
        } else {
            $lugare->carreras_preferenciales()->sync([]);
        }

        return redirect()->route('lugares.index')
            ->with('success', 'Lugar de pasantía actualizado exitosamente.');
    }

    public function destroy(LugarPasantia $lugare)
    {
        Gate::authorize('admin');
        
        $lugare->delete();

        return redirect()->route('lugares.index')
            ->with('success', 'Lugar de pasantía eliminado exitosamente.');
    }
}
