import { Head, Link } from '@inertiajs/react';

interface Estudiante {
    id: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    correo: string;
    curso?: {
        nombre: string;
        carrera?: { nombre: string };
    };
    asignaciones?: any[]; // Simplified for this view
}

export default function Show({ estudiante }: { estudiante: Estudiante }) {
    return (
        <>
            <Head title={`Estudiante: ${estudiante.nombres}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {estudiante.nombres} {estudiante.apellidos}
                        </h1>
                        <p className="text-sm text-gray-500">C.I. {estudiante.cedula}</p>
                    </div>
                    <Link
                        href={`/estudiantes/${estudiante.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    >
                        Editar
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-md border p-6 bg-white dark:bg-zinc-950 dark:border-zinc-800">
                        <h3 className="mb-4 text-lg font-medium">Información Personal</h3>
                        <dl className="grid gap-2 text-sm">
                            <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-zinc-800">
                                <dt className="font-medium text-zinc-500">Nombres:</dt>
                                <dd>{estudiante.nombres}</dd>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-zinc-800">
                                <dt className="font-medium text-zinc-500">Apellidos:</dt>
                                <dd>{estudiante.apellidos}</dd>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-zinc-800">
                                <dt className="font-medium text-zinc-500">Cédula:</dt>
                                <dd>{estudiante.cedula}</dd>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <dt className="font-medium text-zinc-500">Correo Electrónico:</dt>
                                <dd>{estudiante.correo || 'No especificado'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-md border p-6 bg-white dark:bg-zinc-950 dark:border-zinc-800">
                        <h3 className="mb-4 text-lg font-medium">Información Académica</h3>
                        <dl className="grid gap-2 text-sm">
                            <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-zinc-800">
                                <dt className="font-medium text-zinc-500">Curso:</dt>
                                <dd>{estudiante.curso?.nombre}</dd>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <dt className="font-medium text-zinc-500">Carrera:</dt>
                                <dd>{estudiante.curso?.carrera?.nombre}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Estudiantes',
            href: '/estudiantes',
        },
        {
            title: 'Detalles',
            href: '#',
        },
    ],
};
