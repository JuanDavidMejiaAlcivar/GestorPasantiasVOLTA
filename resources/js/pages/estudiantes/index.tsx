import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2, Search, X } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Carrera {
    nombre: string;
}

interface Estudiante {
    id: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    correo: string | null;
    asignaciones_count: number;
    carrera: Carrera | null;
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

export default function Index({ estudiantes, filters }: { estudiantes: Estudiante[], filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search || '');

    function handleDelete(id: number) {
        if (confirm('¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.')) {
            router.delete(`/estudiantes/${id}`);
        }
    }

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get('/estudiantes', { search }, { preserveState: true, replace: true });
    }

    function clearSearch() {
        setSearch('');
        router.get('/estudiantes', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Estudiantes" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Estudiantes</h1>
                        <p className="text-sm text-zinc-500">
                            {estudiantes.length} estudiante{estudiantes.length !== 1 ? 's' : ''} registrado{estudiantes.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href="/estudiantes/create"
                        className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Añadir Estudiante
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex items-center">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, apellido o cédula..."
                            className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-10 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 text-zinc-400 hover:text-zinc-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                        <button type="submit" className="sr-only">Buscar</button>
                    </form>
                </div>

                {/* Tabla */}
                <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-zinc-50 dark:bg-zinc-800/60">
                            <tr>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Cédula</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Nombres y Apellidos</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Correo</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Carrera</th>
                                <th className="h-10 px-4 text-center font-medium text-zinc-500">Pasantía</th>
                                <th className="h-10 px-4 text-right font-medium text-zinc-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {estudiantes.length > 0 ? (
                                estudiantes.map((est) => (
                                    <tr key={est.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                                            {est.cedula}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {est.nombres} {est.apellidos}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500">
                                            {est.correo ?? <span className="italic text-zinc-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                            {est.carrera ? est.carrera.nombre : <span className="italic text-zinc-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <PasantiaBadge count={est.asignaciones_count} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/estudiantes/${est.id}/edit`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(est.id)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/40"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center text-zinc-400">
                                        No se encontraron estudiantes con esos criterios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Estudiantes', href: '/estudiantes' }],
};
