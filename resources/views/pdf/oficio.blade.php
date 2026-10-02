<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Oficio {{ $oficio->numero_oficio }}</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 2rem; }
        .content { margin: 0 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Unidad Educativa Alessandro Volta</h2>
        <h3>Oficio de Pasantía</h3>
    </div>
    
    <div class="content">
        <p><strong>Nro Oficio:</strong> {{ $oficio->numero_oficio }}</p>
        <p><strong>Tipo:</strong> {{ ucfirst($oficio->tipo) }}</p>
        
        <hr>
        
        <h4>Datos del Estudiante</h4>
        <p><strong>Nombre:</strong> {{ $oficio->asignacion->estudiante->nombres }} {{ $oficio->asignacion->estudiante->apellidos }}</p>
        <p><strong>Cédula:</strong> {{ $oficio->asignacion->estudiante->cedula }}</p>
        
        <h4>Lugar de Pasantía</h4>
        <p><strong>Empresa:</strong> {{ $oficio->asignacion->lugarPasantia->nombre_empresa }}</p>
        <p><strong>Dirección:</strong> {{ $oficio->asignacion->lugarPasantia->direccion }}</p>
        <p><strong>Contacto:</strong> {{ $oficio->asignacion->lugarPasantia->contacto_nombre }} ({{ $oficio->asignacion->lugarPasantia->contacto_telefono }})</p>
        
        <br><br>
        <p>Este documento es generado automáticamente por el sistema de Gestión de Pasantías.</p>
    </div>
</body>
</html>
