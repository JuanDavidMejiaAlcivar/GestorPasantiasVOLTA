<?php

namespace App\Http\Controllers;

use App\Models\Asignacion;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function descargarCarta(Request $request)
    {
        $user = $request->user();

        // Si es estudiante, verificamos que tenga una asignación activa
        if ($user->isEstudiante()) {
            $estudianteId = $user->estudiante->id;
            $asignacion = Asignacion::with(['estudiante.carrera', 'lugarPasantia'])
                ->where('estudiante_id', $estudianteId)
                ->whereIn('estado', ['pendiente', 'en_curso', 'finalizada']) // cualquier pasantía asignada
                ->orderByDesc('created_at')
                ->first();

            if (!$asignacion) {
                return redirect()->back()->with('error', 'No tienes ninguna pasantía asignada para generar el documento.');
            }
        } else if ($user->isAdmin()) {
            // Si es admin, puede pedirlo por ID
            $request->validate([
                'asignacion_id' => 'required|exists:asignacions,id'
            ]);
            $asignacion = Asignacion::with(['estudiante.carrera', 'lugarPasantia'])
                ->findOrFail($request->asignacion_id);
        } else {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        $pdf = Pdf::loadView('pdf.carta_presentacion', [
            'asignacion' => $asignacion,
            'estudiante' => $asignacion->estudiante,
            'empresa' => $asignacion->lugarPasantia,
        ]);

        return $pdf->download('carta_presentacion_' . $asignacion->estudiante->cedula . '.pdf');
    }
}
