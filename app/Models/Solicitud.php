<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'lugar_pasantia_id',
        'estado',
        'comentarios',
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }

    public function lugarPasantia()
    {
        return $this->belongsTo(LugarPasantia::class);
    }
}
