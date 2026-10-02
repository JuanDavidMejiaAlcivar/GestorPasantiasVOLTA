<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Carta de Pasantía</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 50px 60px;
            color: #000;
            line-height: 1.5;
            font-size: 12pt;
        }
        .date {
            text-align: right;
            margin-bottom: 40px;
        }
        .recipient {
            margin-bottom: 30px;
            line-height: 1.3;
        }
        .reference {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 30px;
        }
        .content {
            text-align: justify;
            margin-bottom: 30px;
        }
        .content p {
            margin-bottom: 15px;
        }
        .signature-area {
            margin-top: 100px;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #000;
            width: 300px;
            margin: 0 auto 5px;
        }
        .signature-details {
            line-height: 1.3;
        }
    </style>
</head>
<body>

    @php
        $meses = ['January' => 'Enero', 'February' => 'Febrero', 'March' => 'Marzo', 'April' => 'Abril', 'May' => 'Mayo', 'June' => 'Junio', 'July' => 'Julio', 'August' => 'Agosto', 'September' => 'Septiembre', 'October' => 'Octubre', 'November' => 'Noviembre', 'December' => 'Diciembre'];
        $mes = $meses[\Carbon\Carbon::now()->format('F')];
        $dia = \Carbon\Carbon::now()->format('d');
        $anio = \Carbon\Carbon::now()->format('Y');
    @endphp

    <div class="date">
        Santo Domingo de los Tsáchilas, {{ $dia }} de {{ $mes }} de {{ $anio }}
    </div>

    <div class="recipient">
        Señor(a)<br>
        {{ $empresa->contacto_nombre }}<br>
        <strong>REPRESENTANTE DE LA EMPRESA</strong><br>
        <strong>{{ mb_strtoupper($empresa->nombre_empresa) }}</strong><br>
        Presente:
    </div>

    <div class="reference">
        Ref: PRESENTACIÓN PARA PASANTÍA
    </div>

    <div class="content">
        <p>Por medio de la presente me dirijo a usted amablemente, para saludarle y desearle éxitos en las funciones que desempeña.</p>
        
        <p>El motivo de la presente es para formalizar la vinculación y presentación del estudiante <strong>{{ $estudiante->nombres }} {{ $estudiante->apellidos }}</strong>, portador de la C.I. <strong>{{ $estudiante->cedula }}</strong>, perteneciente a la carrera de <strong>{{ $estudiante->carrera->nombre ?? 'N/A' }}</strong>, quien ha sido debidamente aprobado para realizar su práctica profesional bajo la modalidad de PASANTÍA en su prestigiosa institución.</p>
        
        <p>Confiamos en que la colaboración entre nuestra institución académica y su empresa contribuirá significativamente a la formación profesional del estudiante, permitiéndole aplicar los conocimientos adquiridos.</p>
        
        <p>Sin otro en particular, agradecerle de antemano su gentil concurrencia, me despido con las consideraciones más distinguidas a la espera de una respuesta favorable.</p>
    </div>

    <p>Atentamente;</p>

    <div class="signature-area">
        <div class="signature-line"></div>
        Firma del Representante de la Empresa<br><br>
        <div class="signature-details">
            Est. {{ $estudiante->nombres }} {{ $estudiante->apellidos }}<br>
            C.I. {{ $estudiante->cedula }}<br>
            Carrera: {{ $estudiante->carrera->nombre ?? 'N/A' }}
        </div>
    </div>

</body>
</html>
