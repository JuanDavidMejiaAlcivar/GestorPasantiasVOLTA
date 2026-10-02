<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @use HasFactory<Factory<Asignacion>>
 */
class Asignacion extends Model
{
    /** @use HasFactory<Factory<Asignacion>> */
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'lugar_pasantia_id',
        'fecha_inicio',
        'fecha_fin',
        'estado'
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }

    public function lugarPasantia()
    {
        return $this->belongsTo(LugarPasantia::class);
    }

    public function oficios()
    {
        return $this->hasMany(Oficio::class);
    }
}
