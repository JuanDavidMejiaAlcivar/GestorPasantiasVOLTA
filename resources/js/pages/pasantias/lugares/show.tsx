import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Building2, Plus, X, Pencil, Trash2, Calendar, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { SharedData } from '@/types';

interface Asignacion {
    id: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    estado: 'pendiente' | 'en_curso' | 'finalizada';
    estudiante: {
        nombres: string;
        apellidos: string;
        cedula: string;
        carrera: { nombre: string } | null;
    };
}

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
    asignaciones: Asignacion[];
    carreras_preferenciales: Carrera[];
}

interface Estudiante {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    carrera: { nombre: string } | null;
}

function EstadoBadge({ estado }: { estado: string }) {
    const styles: Record<string, string> = {
        pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
        en_curso: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        finalizada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    const labels: Record<string, string> = {
        pendiente: 'Pendiente',
        en_curso: 'En Curso',
        finalizada: 'Finalizada',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[estado] || ''}`}>
            {labels[estado] || estado}
        </span>
    );
}

// ── DIÁLOGO/MODAL COMÚN ──
function Dialog({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg dark:bg-zinc-950 dark:border dark:border-zinc-800">
                <div className="flex items-center justify-between border-b px-4 py-3 dark:border-zinc-800">
                    <h3 className="font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

// ── FORMULARIO NUEVA ASIGNACIÓN ──
function AsignarForm({ lugarId, estudiantes, onClose }: { lugarId: number, estudiantes: Estudiante[], onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        estudiante_id: '',
        lugar_pasantia_id: lugarId.toString(),
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'pendiente' as const,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/asignaciones', {
            onSuccess: () => onClose(),
        });
    }

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-1.5">
                <label className="text-sm font-medium">Estudiante Disponible</label>
                <select
                    value={data.estudiante_id}
                    onChange={(e) => setData('estudiante_id', e.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                >
                    <option value="">— Selecciona un estudiante —</option>
                    {estudiantes.map((est) => (
                        <option key={est.id} value={est.id}>
                            {est.nombres} {est.apellidos} ({est.cedula}) - {est.carrera?.nombre}
                        </option>
                    ))}
                </select>
                {errors.estudiante_id && <p className="text-xs text-red-500">{errors.estudiante_id}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-zinc-500">Inicio (Opcional)</label>
                    <input
                        type="date"
                        value={data.fecha_inicio}
                        onChange={(e) => setData('fecha_inicio', e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                    />
                </div>
                <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-zinc-500">Fin (Opcional)</label>
                    <input
                        type="date"
                        value={data.fecha_fin}
                        onChange={(e) => setData('fecha_fin', e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                    />
                </div>
            </div>

            <div className="grid gap-1.5">
                <label className="text-sm font-medium">Estado</label>
                <select
                    value={data.estado}
                    onChange={(e) => setData('estado', e.target.value as any)}
                    className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En Curso</option>
                    <option value="finalizada">Finalizada</option>
                </select>
            </div>

            <div className="flex justify-end pt-2 gap-2">
                <button type="button" onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex h-9 items-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {processing ? 'Asignando...' : 'Asignar Estudiante'}
                </button>
            </div>
        </form>
    );
}

// ── FORMULARIO EDITAR ASIGNACIÓN ──
function EditAsignacionForm({ asignacion, onClose }: { asignacion: Asignacion, onClose: () => void }) {
    const { data, setData, put, processing } = useForm({
        fecha_inicio: asignacion.fecha_inicio ?? '',
        fecha_fin: asignacion.fecha_fin ?? '',
        estado: asignacion.estado,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/asignaciones/${asignacion.id}`, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-zinc-500">Fecha de Inicio</label>
                    <input
                        type="date"
                        value={data.fecha_inicio}
                        onChange={(e) => setData('fecha_inicio', e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                    />
                </div>
                <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-zinc-500">Fecha de Fin</label>
                    <input
                        type="date"
                        value={data.fecha_fin}
                        onChange={(e) => setData('fecha_fin', e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                    />
                </div>
            </div>

            <div className="grid gap-1.5">
                <label className="text-sm font-medium">Estado de Pasantía</label>
                <select
                    value={data.estado}
                    onChange={(e) => setData('estado', e.target.value as any)}
                    className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En Curso</option>
                    <option value="finalizada">Finalizada</option>
                </select>
            </div>

            <div className="flex justify-end pt-2 gap-2">
                <button type="button" onClick={onClose} className="inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex h-9 items-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
}

export default function Show({ lugar, estudiantesDisponibles, userRole }: { lugar: LugarPasantia, estudiantesDisponibles: Estudiante[], userRole?: string }) {
    const { auth } = usePage<SharedData>().props;
    const role = userRole || auth?.user?.role || 'user';
    
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [editingAsignacion, setEditingAsignacion] = useState<Asignacion | null>(null);

    function handleDelete(id: number) {
        if (confirm('¿Dar de baja esta pasantía? El estudiante quedará libre.')) {
            router.delete(`/asignaciones/${id}`);
        }
    }

    return (
        <>
            <Head title={lugar.nombre_empresa} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">

                {/* Back Button & Header */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-4">
                        <Link 
                            href="/lugares" 
                            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Regresar a Lugares
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                <Building2 className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold">{lugar.nombre_empresa}</h1>
                                <p className="text-sm text-gray-500">
                                    {lugar.asignaciones.length} de {lugar.cupos} cupos ocupados
                                </p>
                            </div>
                        </div>
                    </div>
                    {role === 'admin' && (
                        <Link
                            href={`/lugares/${lugar.id}/edit`}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white mt-9 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
                        >
                            Editar Empresa
                        </Link>
                    )}
                </div>

                {/* Info & Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-md border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800">
                        <h3 className="font-medium text-sm mb-2 text-zinc-500">Información del Lugar</h3>
                        <div className="text-sm space-y-1">
                            <p><strong>Dirección:</strong> {lugar.direccion}</p>
                            <p><strong>Cupos Totales:</strong> {lugar.cupos}</p>
                        </div>
                    </div>
                    <div className="rounded-md border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800">
                        <h3 className="font-medium text-sm mb-2 text-zinc-500">Tutor / Contacto</h3>
                        <div className="text-sm space-y-1">
                            <p><strong>Nombre:</strong> {lugar.contacto_nombre}</p>
                            <p><strong>Teléfono:</strong> {lugar.contacto_telefono}</p>
                            {lugar.contacto_email && <p><strong>Correo:</strong> {lugar.contacto_email}</p>}
                        </div>
                    </div>
                    <div className="rounded-md border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800">
                        <h3 className="font-medium text-sm mb-2 text-zinc-500">Carreras Preferidas</h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {lugar.carreras_preferenciales && lugar.carreras_preferenciales.length > 0 ? (
                                lugar.carreras_preferenciales.map(c => (
                                    <span key={c.id} className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                        {c.nombre}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm italic text-zinc-400">Sin preferencias</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Estudiantes */}
                <div className="grid gap-4 mt-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Estudiantes Asignados</h2>
                        {role === 'admin' && (
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                            >
                                <Plus className="h-4 w-4" />
                                Asignar Estudiante
                            </button>
                        )}
                    </div>

                    {role === 'admin' && (
                        <Dialog isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Nueva Asignación de Pasantía">
                            <AsignarForm
                                lugarId={lugar.id}
                                estudiantes={estudiantesDisponibles}
                                onClose={() => setShowAssignModal(false)}
                            />
                        </Dialog>
                    )}

                    {role === 'admin' && (
                        <Dialog isOpen={editingAsignacion !== null} onClose={() => setEditingAsignacion(null)} title="Editar Estado de Pasantía">
                            {editingAsignacion && (
                                <EditAsignacionForm
                                    asignacion={editingAsignacion}
                                    onClose={() => setEditingAsignacion(null)}
                                />
                            )}
                        </Dialog>
                    )}
                    
                    {lugar.asignaciones.length > 0 ? (
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-zinc-50 dark:bg-zinc-800/60">
                                    <tr>
                                        <th className="h-10 px-4 text-left font-medium text-zinc-500">Estudiante</th>
                                        <th className="h-10 px-4 text-left font-medium text-zinc-500">Fechas</th>
                                        <th className="h-10 px-4 text-center font-medium text-zinc-500">Estado</th>
                                        {role === 'admin' && (
                                            <th className="h-10 px-4 text-right font-medium text-zinc-500">Acción</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {lugar.asignaciones.map((asig) => (
                                        <tr key={asig.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                            <td className="px-4 py-4 align-middle">
                                                <div className="font-medium">
                                                    {role === 'admin' ? `${asig.estudiante.nombres} ${asig.estudiante.apellidos}` : 'Estudiante Asignado'}
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-0.5">
                                                    {role === 'admin' ? `C.I. ${asig.estudiante.cedula} · ${asig.estudiante.carrera?.nombre}` : asig.estudiante.carrera?.nombre}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle text-zinc-600 dark:text-zinc-400">
                                                {(asig.fecha_inicio || asig.fecha_fin) ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3 text-zinc-400" />
                                                        <span className="text-xs">
                                                            {asig.fecha_inicio || 'TBD'} — {asig.fecha_fin || 'TBD'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="italic text-zinc-400 text-xs">Fechas sin definir</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 align-middle text-center">
                                                <EstadoBadge estado={asig.estado} />
                                            </td>
                                            {role === 'admin' && (
                                                <td className="px-4 py-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingAsignacion(asig)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                            title="Editar Fechas/Estado"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(asig.id)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:bg-zinc-900 dark:border-red-900 dark:hover:bg-red-950/50"
                                                            title="Dar de baja (Quitar asignación)"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-md border border-dashed p-8 text-center text-sm text-zinc-400 dark:border-zinc-700">
                            Ningún estudiante está realizando pasantías en este lugar actualmente.
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Lugares de Pasantía', href: '/lugares' },
        { title: 'Detalles', href: '#' },
    ],
};
