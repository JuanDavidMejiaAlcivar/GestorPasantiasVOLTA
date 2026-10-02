<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('estudiantes', \App\Http\Controllers\EstudianteController::class);
    Route::resource('carreras', \App\Http\Controllers\CarreraController::class);
    Route::resource('lugares', \App\Http\Controllers\LugarPasantiaController::class)->parameters(['lugares' => 'lugare']);
    Route::resource('asignaciones', \App\Http\Controllers\AsignacionController::class)->only(['store', 'update', 'destroy']);
    Route::get('asignaciones', fn() => redirect()->route('lugares.index')); // Evitar error 405
    Route::resource('solicitudes', \App\Http\Controllers\SolicitudController::class)->only(['index', 'store', 'update']);
    Route::redirect('pasantias', 'lugares');
    Route::get('/descargar-carta-presentacion', [\App\Http\Controllers\PdfController::class, 'descargarCarta'])->name('pdf.carta');
});

require __DIR__.'/settings.php';
