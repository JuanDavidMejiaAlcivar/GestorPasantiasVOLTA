<?php

namespace App\Http\Controllers;

use App\Models\Asignacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AsignacionController extends Controller
{
    public function store(Request $request)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'estudiante_id'     => 'required|exists:estudiantes,id|unique:asignacions,estudiante_id',
            'lugar_pasantia_id' => 'required|exists:lugar_pasantias,id',
            'fecha_inicio'      => 'nullable|date',
            'fecha_fin'         => 'nullable|date|after_or_equal:fecha_inicio',
            'estado'            => 'required|in:pendiente,en_curso,finalizada',
        ]);

        Asignacion::create($validated);

        return redirect()->back()->with('success', 'Pasantía asignada exitosamente.');
    }

    public function update(Request $request, Asignacion $asignacione)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'fecha_inicio'      => 'nullable|date',
            'fecha_fin'         => 'nullable|date|after_or_equal:fecha_inicio',
            'estado'            => 'required|in:pendiente,en_curso,finalizada',
        ]);

        $asignacione->update($validated);

        return redirect()->back()->with('success', 'Estado de la asignación actualizado.');
    }

    public function destroy(Asignacion $asignacione)
    {
        Gate::authorize('admin');
        
        $asignacione->delete();

        return redirect()->back()->with('success', 'Asignación dada de baja exitosamente.');
    }
}
