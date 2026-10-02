<?php

namespace App\Http\Controllers;

use App\Models\Asignacion;
use App\Models\LugarPasantia;
use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SolicitudController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $solicitudes = Solicitud::with(['estudiante.carrera', 'lugarPasantia'])
                ->orderByDesc('created_at')
                ->get();
            return inertia('solicitudes/index', compact('solicitudes'));
        }

        if ($user->isEstudiante()) {
            $estudianteId = $user->estudiante?->id;
            
            if (!$estudianteId) {
                return redirect()->route('dashboard')->with('error', 'No tienes un perfil de estudiante enlazado.');
            }

            $solicitudes = Solicitud::with('lugarPasantia')
                ->where('estudiante_id', $estudianteId)
                ->orderByDesc('created_at')
                ->get();
            return inertia('solicitudes/index', compact('solicitudes'));
        }

        abort(403, 'No tienes permisos para ver solicitudes.');
    }

    public function store(Request $request)
    {
        $user = $request->user();
        Gate::authorize('estudiante');

        $estudiante = $user->estudiante;
        
        if (!$estudiante) {
            return redirect()->back()->with('error', 'No tienes un perfil de estudiante.');
        }

        // Verifica si ya tiene pasantía activa (Asignación)
        $tieneAsignacion = Asignacion::where('estudiante_id', $estudiante->id)
            ->whereIn('estado', ['pendiente', 'en_curso'])
            ->exists();

        if ($tieneAsignacion) {
            return redirect()->back()->with('error', 'Ya tienes una pasantía activa asignada.');
        }

        // Verifica si ya tiene una solicitud pendiente
        $tienePendiente = Solicitud::where('estudiante_id', $estudiante->id)
            ->where('estado', 'pendiente')
            ->exists();

        if ($tienePendiente) {
            return redirect()->back()->with('error', 'Ya tienes una solicitud de cupo pendiente.');
        }

        $validated = $request->validate([
            'lugar_pasantia_id' => 'required|exists:lugar_pasantias,id',
        ]);

        Solicitud::create([
            'estudiante_id' => $estudiante->id,
            'lugar_pasantia_id' => $validated['lugar_pasantia_id'],
            'estado' => 'pendiente',
        ]);

        return redirect()->back()->with('success', 'Solicitud de cupo enviada exitosamente.');
    }

    public function update(Request $request, Solicitud $solicitude)
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'estado' => 'required|in:aceptada,rechazada',
            'comentarios' => 'nullable|string',
        ]);

        $solicitude->update($validated);

        // Si es aceptada, creamos automáticamente la asignación
        if ($validated['estado'] === 'aceptada') {
            
            // Check si ya no tiene otra
            $tieneAsignacion = Asignacion::where('estudiante_id', $solicitude->estudiante_id)
                ->whereIn('estado', ['pendiente', 'en_curso'])
                ->exists();
                
            if (!$tieneAsignacion) {
                Asignacion::create([
                    'estudiante_id' => $solicitude->estudiante_id,
                    'lugar_pasantia_id' => $solicitude->lugar_pasantia_id,
                    'estado' => 'pendiente',
                ]);
            }
            
            // Rechazar otras solicitudes pendientes del mismo estudiante
            Solicitud::where('estudiante_id', $solicitude->estudiante_id)
                ->where('id', '!=', $solicitude->id)
                ->where('estado', 'pendiente')
                ->update(['estado' => 'rechazada', 'comentarios' => 'Rechazada automáticamente porque se aceptó otra solicitud.']);
        }

        return redirect()->route('solicitudes.index')->with('success', 'Solicitud procesada correctamente.');
    }
}
