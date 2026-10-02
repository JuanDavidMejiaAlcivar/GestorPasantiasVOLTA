<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @use HasFactory<Factory<LugarPasantia>>
 */
class LugarPasantia extends Model
{
    /** @use HasFactory<Factory<LugarPasantia>> */
    use HasFactory;

    protected $fillable = [
        'nombre_empresa',
        'direccion',
        'contacto_nombre',
        'contacto_telefono',
        'contacto_email',
        'cupos'
    ];

    public function carreras_preferenciales()
    {
        return $this->belongsToMany(Carrera::class, 'carrera_lugar_pasantia');
    }

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class);
    }
}
