<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @use HasFactory<Factory<Estudiante>>
 */
class Estudiante extends Model
{
    /** @use HasFactory<Factory<Estudiante>> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'carrera_id',
        'cedula',
        'nombres',
        'apellidos',
        'correo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function carrera()
    {
        return $this->belongsTo(Carrera::class);
    }

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class);
    }
}
