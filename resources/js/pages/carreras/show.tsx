import { Head, Link } from '@inertiajs/react';
import { BookOpenText } from 'lucide-react';

interface Estudiante {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    asignaciones_count: number;
}

interface Carrera {
    id: number;
    nombre: string;
    descripcion: string | null;
    estudiantes: Estudiante[];
}

function PasantiaBadge({ count }: { count: number }) {
    return count > 0 ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Con Pasantía
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Sin Pasantía
        </span>
    );
}

export default function Show({ carrera }: { carrera: Carrera }) {
    const totalEstudiantes = carrera.estudiantes.length;
    const conPasantia = carrera.estudiantes.filter((e) => e.asignaciones_count > 0).length;
    const sinPasantia = totalEstudiantes - conPasantia;

    return (
        <>
            <Head title={carrera.nombre} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <BookOpenText className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{carrera.nombre}</h1>
                            <p className="text-sm text-gray-500">
                                {totalEstudiantes} estudiantes en total
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/carreras/${carrera.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    >
                        Editar Carrera
                    </Link>
                </div>

                {/* Descripción */}
                {carrera.descripcion && (
                    <div className="rounded-md border bg-white p-4 text-sm text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400">
                        {carrera.descripcion}
                    </div>
                )}

                {/* Stats rápidos */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-md border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500">Total Estudiantes</p>
                        <p className="mt-1 text-2xl font-bold">{totalEstudiantes}</p>
                    </div>
                    <div className="rounded-md border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500">Con Pasantía</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">{conPasantia}</p>
                    </div>
                    <div className="rounded-md border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500">Sin Pasantía</p>
                        <p className="mt-1 text-2xl font-bold text-red-600">{sinPasantia}</p>
                    </div>
                </div>

                {/* ── Estudiantes ── */}
                <div className="grid gap-4 mt-2">
                    <h2 className="text-lg font-medium">Estudiantes de la Carrera</h2>
                    
                    {carrera.estudiantes.length > 0 ? (
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-zinc-50 dark:bg-zinc-800/60">
                                    <tr>
                                        <th className="h-10 px-4 text-left font-medium text-zinc-500">Nombre</th>
                                        <th className="h-10 px-4 text-left font-medium text-zinc-500">Cédula</th>
                                        <th className="h-10 px-4 text-center font-medium text-zinc-500">Estado Pasantía</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {carrera.estudiantes.map((est) => (
                                        <tr key={est.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                            <td className="p-4 align-middle font-medium">
                                                {est.nombres} {est.apellidos}
                                            </td>
                                            <td className="p-4 align-middle font-mono text-xs text-zinc-500">
                                                {est.cedula}
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <PasantiaBadge count={est.asignaciones_count} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-md border border-dashed p-8 text-center text-sm text-zinc-400 dark:border-zinc-700">
                            No hay estudiantes asignados a esta carrera.
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Carreras', href: '/carreras' },
        { title: 'Detalle', href: '#' },
    ],
};
