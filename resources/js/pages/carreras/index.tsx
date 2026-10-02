import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2, ChevronRight, Search, X } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Carrera {
    id: number;
    nombre: string;
    descripcion: string | null;
}

export default function Index({ carreras, filters }: { carreras: Carrera[], filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search || '');

    function handleDelete(id: number) {
        if (confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
            router.delete(`/carreras/${id}`);
        }
    }

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get('/carreras', { search }, { preserveState: true, replace: true });
    }

    function clearSearch() {
        setSearch('');
        router.get('/carreras', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Carreras" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Carreras</h1>
                        <p className="text-sm text-zinc-500">
                            {carreras.length} carrera{carreras.length !== 1 ? 's' : ''} registrada{carreras.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href="/carreras/create"
                        className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Nueva Carrera
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
                            placeholder="Buscar por nombre de carrera..."
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
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Nombre</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Descripción</th>
                                <th className="h-10 px-4 text-right font-medium text-zinc-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {carreras.length > 0 ? (
                                carreras.map((carrera) => (
                                    <tr key={carrera.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                        <td className="px-4 py-3 font-medium">
                                            <Link
                                                href={`/carreras/${carrera.id}`}
                                                className="inline-flex items-center gap-1 hover:underline"
                                            >
                                                {carrera.nombre}
                                                <ChevronRight className="h-3 w-3 text-zinc-400" />
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500">
                                            {carrera.descripcion ?? (
                                                <span className="italic text-zinc-400">Sin descripción</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/carreras/${carrera.id}/edit`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(carrera.id)}
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
                                    <td colSpan={3} className="h-32 text-center text-zinc-400">
                                        No se encontraron carreras.
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
    breadcrumbs: [{ title: 'Carreras', href: '/carreras' }],
};
