<?php

namespace App\Http\Controllers;

use App\Models\Oficio;
use Illuminate\Http\Request;

class OficioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        \Illuminate\Support\Facades\Gate::authorize('admin');
    }

    public function create()
    {
        \Illuminate\Support\Facades\Gate::authorize('admin');
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('admin');
    }

    public function show(Oficio $oficio)
    {
        //
    }

    public function downloadPdf(Oficio $oficio)
    {
        $user = auth()->user();
        if ($user->isEstudiante() && $oficio->asignacion->estudiante->user_id !== $user->id) {
            abort(403, 'No autorizado.');
        }

        // Obtener datos para la vista del PDF
        $oficio->load('asignacion.estudiante', 'asignacion.lugarPasantia');
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.oficio', compact('oficio'));
        
        return $pdf->download('oficio_' . $oficio->numero_oficio . '.pdf');
    }

    public function edit(Oficio $oficio)
    {
        \Illuminate\Support\Facades\Gate::authorize('admin');
    }

    public function update(Request $request, Oficio $oficio)
    {
        \Illuminate\Support\Facades\Gate::authorize('admin');
    }

    public function destroy(Oficio $oficio)
    {
        \Illuminate\Support\Facades\Gate::authorize('admin');
    }
}
