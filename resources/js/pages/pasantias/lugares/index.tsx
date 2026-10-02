import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2, Building2, Search, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import type { SharedData } from '@/types';

interface Carrera {
    id: number;
    nombre: string;
}

interface LugarPasantia {
    id: number;
    nombre_empresa: string;
    direccion: string;
    contacto_nombre: string;
    contacto_telefono: string;
    contacto_email: string | null;
    cupos: number;
    asignaciones_count: number;
    carreras_preferenciales: Carrera[];
}

export default function Index({ lugares, filters, userRole, miPasantiaId }: { lugares: LugarPasantia[], filters?: { search?: string }, userRole?: string, miPasantiaId?: number | null }) {
    const { auth, flash } = usePage<SharedData & { flash?: { success?: string, error?: string } }>().props;
    const role = userRole || auth?.user?.role || 'user';
    
    const [search, setSearch] = useState(filters?.search || '');
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Ordenar para que miPasantiaId quede de primero
    const sortedLugares = [...lugares].sort((a, b) => {
        if (a.id === miPasantiaId) return -1;
        if (b.id === miPasantiaId) return 1;
        return 0;
    });

    function handleDelete(id: number) {
        if (confirm('¿Estás seguro de que deseas eliminar este lugar? Se darán de baja las pasantías asignadas aquí.')) {
            router.delete(`/lugares/${id}`);
        }
    }

    function handleRequestPasantia(lugarId: number) {
        if (miPasantiaId) {
            alert('Ya tienes una pasantía activa asignada. No puedes solicitar otro cupo.');
            return;
        }
        if (confirm('¿Deseas enviar una solicitud de cupo a esta empresa?')) {
            router.post('/solicitudes', { lugar_pasantia_id: lugarId });
        }
    }

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get('/lugares', { search }, { preserveState: true, replace: true });
    }

    function clearSearch() {
        setSearch('');
        router.get('/lugares', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Lugares de Pasantía" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                {/* Flash Messages */}
                {showFlash && flash?.success && (
                    <div className="flex items-center gap-3 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{flash.success}</p>
                    </div>
                )}
                {showFlash && flash?.error && (
                    <div className="flex items-center gap-3 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{flash.error}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Lugares de Pasantía</h1>
                        <p className="text-sm text-zinc-500">
                            Explora las empresas e instituciones para pasantías.
                        </p>
                    </div>
                    {role === 'admin' && (
                        <Link
                            href="/lugares/create"
                            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Añadir Empresa
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <div className="flex items-center">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por empresa o carrera preferida..."
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
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Empresa</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Contacto</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Carreras Preferidas</th>
                                <th className="h-10 px-4 text-center font-medium text-zinc-500">Cupos Ocupados</th>
                                {role !== 'user' && (
                                    <th className="h-10 px-4 text-right font-medium text-zinc-500">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {sortedLugares.length > 0 ? (
                                sortedLugares.map((lugar) => {
                                    const isMiPasantia = lugar.id === miPasantiaId;
                                    return (
                                    <tr 
                                        key={lugar.id} 
                                        className={`transition-colors ${isMiPasantia ? 'bg-green-50/70 border-l-4 border-green-500 dark:bg-green-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Building2 className={`h-4 w-4 ${isMiPasantia ? 'text-green-600' : 'text-zinc-400'}`} />
                                                <Link href={`/lugares/${lugar.id}`} className="hover:underline text-zinc-900 dark:text-zinc-100">
                                                    {lugar.nombre_empresa}
                                                </Link>
                                                {isMiPasantia && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase tracking-wide dark:bg-green-900/40 dark:text-green-400">
                                                        Tu Pasantía Actual
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 text-xs font-normal text-zinc-500 truncate max-w-[200px]" title={lugar.direccion}>
                                                {lugar.direccion}
                                            </div>
                                            {isMiPasantia && (
                                                <div className="mt-2">
                                                    <a 
                                                        href="/descargar-carta-presentacion" 
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-md bg-white border border-green-200 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:bg-zinc-900 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-900/30"
                                                    >
                                                        Descargar (PDF)
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>{lugar.contacto_nombre}</div>
                                            <div className="text-xs text-zinc-500 font-mono mt-0.5">{lugar.contacto_telefono}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {lugar.carreras_preferenciales && lugar.carreras_preferenciales.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {lugar.carreras_preferenciales.slice(0, 2).map(c => (
                                                        <span key={c.id} className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                            {c.nombre}
                                                        </span>
                                                    ))}
                                                    {lugar.carreras_preferenciales.length > 2 && (
                                                        <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                            +{lugar.carreras_preferenciales.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs italic text-zinc-400">Cualquiera</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                                                <span className={lugar.asignaciones_count >= lugar.cupos ? 'text-red-600' : 'text-zinc-900 dark:text-zinc-100'}>
                                                    {lugar.asignaciones_count}
                                                </span>
                                                <span className="text-zinc-400">/ {lugar.cupos}</span>
                                            </div>
                                        </td>
                                        
                                        {role !== 'user' && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {role === 'admin' && (
                                                        <>
                                                            <Link
                                                                href={`/lugares/${lugar.id}`}
                                                                className="inline-flex h-8 px-2 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                                                                title="Gestionar Asignaciones"
                                                            >
                                                                <span className="text-xs font-medium mr-1">Asignar</span>
                                                            </Link>
                                                            <Link
                                                                href={`/lugares/${lugar.id}/edit`}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                title="Editar Datos"
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(lugar.id)}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/40"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {role === 'estudiante' && (
                                                        <button
                                                            onClick={() => handleRequestPasantia(lugar.id)}
                                                            disabled={!!miPasantiaId || isMiPasantia}
                                                            className={`inline-flex h-8 px-3 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                                                                miPasantiaId 
                                                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500' 
                                                                    : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'
                                                            }`}
                                                            title={miPasantiaId ? "Ya tienes una pasantía activa" : "Solicitar Cupo"}
                                                        >
                                                            {isMiPasantia ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
                                                            {isMiPasantia ? 'Asignado' : 'Pedir Cupo'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan={role !== 'user' ? 5 : 4} className="h-32 text-center text-zinc-400">
                                        No se encontraron lugares de pasantía con esos criterios.
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
    breadcrumbs: [{ title: 'Lugares de Pasantía', href: '/lugares' }],
};
