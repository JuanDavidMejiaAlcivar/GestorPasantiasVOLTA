import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, CheckCircle2, XCircle, Building2, User } from 'lucide-react';
import type { SharedData } from '@/types';

interface Carrera {
    nombre: string;
}

interface Estudiante {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    carrera: Carrera | null;
}

interface LugarPasantia {
    id: number;
    nombre_empresa: string;
}

interface Solicitud {
    id: number;
    estado: 'pendiente' | 'aceptada' | 'rechazada';
    comentarios: string | null;
    created_at: string;
    estudiante: Estudiante | null;
    lugar_pasantia: LugarPasantia;
}

function EstadoBadge({ estado }: { estado: string }) {
    const styles: Record<string, string> = {
        pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
        aceptada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        rechazada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
        pendiente: 'Pendiente',
        aceptada: 'Aceptada',
        rechazada: 'Rechazada',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[estado] || ''}`}>
            {labels[estado] || estado}
        </span>
    );
}

export default function Index({ solicitudes }: { solicitudes: Solicitud[] }) {
    const { auth } = usePage<SharedData>().props;
    const role = auth?.user?.role || 'user';

    function handleAction(id: number, estado: 'aceptada' | 'rechazada') {
        const accionText = estado === 'aceptada' ? 'aceptar' : 'rechazar';
        if (confirm(`¿Estás seguro de que deseas ${accionText} esta solicitud?`)) {
            router.put(`/solicitudes/${id}`, { estado });
        }
    }

    return (
        <>
            <Head title="Solicitudes de Cupo" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Solicitudes de Cupo</h1>
                        <p className="text-sm text-zinc-500">
                            {role === 'admin' 
                                ? 'Gestiona las peticiones de pasantías de los estudiantes.'
                                : 'Estado de tus solicitudes de pasantía.'}
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-zinc-50 dark:bg-zinc-800/60">
                            <tr>
                                {role === 'admin' && (
                                    <th className="h-10 px-4 text-left font-medium text-zinc-500">Estudiante</th>
                                )}
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Empresa Solicitada</th>
                                <th className="h-10 px-4 text-left font-medium text-zinc-500">Fecha</th>
                                <th className="h-10 px-4 text-center font-medium text-zinc-500">Estado</th>
                                {role === 'admin' && (
                                    <th className="h-10 px-4 text-right font-medium text-zinc-500">Acciones</th>
                                )}
                                {role === 'estudiante' && (
                                    <th className="h-10 px-4 text-left font-medium text-zinc-500">Comentarios</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {solicitudes.length > 0 ? (
                                solicitudes.map((sol) => (
                                    <tr key={sol.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                        {role === 'admin' && (
                                            <td className="px-4 py-3 align-middle">
                                                <div className="font-medium flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-zinc-400" />
                                                    {sol.estudiante?.nombres} {sol.estudiante?.apellidos}
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-0.5 ml-5">
                                                    C.I. {sol.estudiante?.cedula} · {sol.estudiante?.carrera?.nombre}
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-4 py-3 align-middle font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="h-4 w-4 text-zinc-400" />
                                                {sol.lugar_pasantia?.nombre_empresa}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-middle text-zinc-500">
                                            {new Date(sol.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 align-middle text-center">
                                            <EstadoBadge estado={sol.estado} />
                                        </td>
                                        
                                        {role === 'admin' && (
                                            <td className="px-4 py-3 align-middle text-right">
                                                {sol.estado === 'pendiente' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAction(sol.id, 'aceptada')}
                                                            className="inline-flex h-8 px-3 items-center justify-center rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900"
                                                            title="Aceptar y Asignar"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                                            <span className="text-xs font-medium">Aceptar</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(sol.id, 'rechazada')}
                                                            className="inline-flex h-8 px-3 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                                                            title="Rechazar"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                                            <span className="text-xs font-medium">Rechazar</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}

                                        {role === 'estudiante' && (
                                            <td className="px-4 py-3 align-middle text-zinc-500 text-xs">
                                                {sol.comentarios ? sol.comentarios : <span className="italic">Sin comentarios.</span>}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={role === 'admin' ? 5 : 4} className="h-32 text-center text-zinc-400">
                                        No se encontraron solicitudes.
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
    breadcrumbs: [{ title: 'Solicitudes', href: '/solicitudes' }],
};
