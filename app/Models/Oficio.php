<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Oficio extends Model
{
    protected $fillable = [
        'asignacion_id',
        'numero_oficio',
        'tipo',
        'archivo_path'
    ];

    public function asignacion()
    {
        return $this->belongsTo(Asignacion::class);
    }
}
