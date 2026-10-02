import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Carrera {
    id: number;
    nombre: string;
}

type FormData = {
    nombre_empresa: string;
    direccion: string;
    contacto_nombre: string;
    contacto_telefono: string;
    contacto_email: string;
    cupos: number;
    carreras: number[];
};

function InputField({
    id, label, type = 'text', value, onChange, error, placeholder, hint,
}: {
    id: string; label: string; type?: string; value: string | number;
    onChange: (v: string) => void; error?: string; placeholder?: string; hint?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
                {hint && <span className="ml-1 font-normal text-zinc-400">{hint}</span>}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function Create({ carreras }: { carreras: Carrera[] }) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        nombre_empresa: '',
        direccion: '',
        contacto_nombre: '',
        contacto_telefono: '',
        contacto_email: '',
        cupos: 1,
        carreras: [],
    });

    function toggleCarrera(id: number) {
        if (data.carreras.includes(id)) {
            setData('carreras', data.carreras.filter(c => c !== id));
        } else {
            setData('carreras', [...data.carreras, id]);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/lugares');
    }

    return (
        <>
            <Head title="Añadir Lugar de Pasantía" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div>
                    <h1 className="text-2xl font-semibold">Añadir Lugar de Pasantía</h1>
                    <p className="text-sm text-zinc-500">Registra una nueva empresa o institución receptora.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5 rounded-md border bg-white p-6 dark:bg-zinc-950 dark:border-zinc-800">
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <InputField
                                id="nombre_empresa"
                                label="Nombre de la Empresa / Institución"
                                value={data.nombre_empresa}
                                onChange={(v) => setData('nombre_empresa', v)}
                                error={errors.nombre_empresa}
                            />
                        </div>
                        <div>
                            <InputField
                                id="cupos"
                                label="Cupos Disponibles"
                                type="number"
                                value={data.cupos}
                                onChange={(v) => setData('cupos', parseInt(v) || 0)}
                                error={errors.cupos}
                            />
                        </div>
                    </div>

                    <InputField
                        id="direccion"
                        label="Dirección Completa"
                        value={data.direccion}
                        onChange={(v) => setData('direccion', v)}
                        error={errors.direccion}
                    />

                    <div className="grid gap-1.5">
                        <label className="text-sm font-medium">
                            Carreras Preferenciales
                            <span className="ml-1 font-normal text-zinc-400">(Opcional)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-1 max-h-48 overflow-y-auto p-2 border border-zinc-200 rounded-md bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-700">
                            {carreras.map((carrera) => (
                                <label key={carrera.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-zinc-100 p-1.5 rounded dark:hover:bg-zinc-800">
                                    <input 
                                        type="checkbox" 
                                        checked={data.carreras.includes(carrera.id)}
                                        onChange={() => toggleCarrera(carrera.id)}
                                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:checked:bg-zinc-50"
                                    />
                                    <span className="truncate">{carrera.nombre}</span>
                                </label>
                            ))}
                        </div>
                        {errors.carreras && <p className="text-xs text-red-500">{errors.carreras}</p>}
                    </div>
                    
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                    <h3 className="font-medium text-sm">Datos de Contacto (Tutor Empresarial)</h3>

                    <InputField
                        id="contacto_nombre"
                        label="Nombre del Contacto"
                        value={data.contacto_nombre}
                        onChange={(v) => setData('contacto_nombre', v)}
                        error={errors.contacto_nombre}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            id="contacto_telefono"
                            label="Teléfono"
                            value={data.contacto_telefono}
                            onChange={(v) => setData('contacto_telefono', v)}
                            error={errors.contacto_telefono}
                        />

                        <InputField
                            id="contacto_email"
                            label="Correo Electrónico"
                            type="email"
                            value={data.contacto_email}
                            onChange={(v) => setData('contacto_email', v)}
                            error={errors.contacto_email}
                            hint="(Opcional)"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            href="/lugares"
                            className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center rounded-md bg-zinc-900 px-6 text-sm font-medium text-zinc-50 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            {processing ? 'Guardando…' : 'Registrar Empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Lugares de Pasantía', href: '/lugares' },
        { title: 'Añadir', href: '#' },
    ],
};
