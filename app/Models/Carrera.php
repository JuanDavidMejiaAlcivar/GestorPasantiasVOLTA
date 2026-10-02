<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @use HasFactory<Factory<Carrera>>
 */
class Carrera extends Model
{
    /** @use HasFactory<Factory<Carrera>> */
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion'];

    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class);
    }

    public function lugares_preferenciales()
    {
        return $this->belongsToMany(LugarPasantia::class, 'carrera_lugar_pasantia');
    }
}
