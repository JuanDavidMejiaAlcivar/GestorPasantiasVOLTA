import { Head, Link, useForm } from '@inertiajs/react';

interface Carrera {
    id: number;
    nombre: string;
}

interface Estudiante {
    id: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    correo: string | null;
    carrera_id: number;
}

type FormData = {
    cedula: string;
    nombres: string;
    apellidos: string;
    correo: string;
    carrera_id: number | string;
};

function InputField({
    id, label, type = 'text', value, onChange, error, hint,
}: {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; error?: string; hint?: string;
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
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function Edit({
    estudiante,
    carreras,
}: {
    estudiante: Estudiante;
    carreras: Carrera[];
}) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        cedula: estudiante.cedula ?? '',
        nombres: estudiante.nombres ?? '',
        apellidos: estudiante.apellidos ?? '',
        correo: estudiante.correo ?? '',
        carrera_id: estudiante.carrera_id ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/estudiantes/${estudiante.id}`);
    }

    return (
        <>
            <Head title="Editar Estudiante" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div>
                    <h1 className="text-2xl font-semibold">Editar Estudiante</h1>
                    <p className="text-sm text-zinc-500">
                        Modifica los datos de{' '}
                        <strong>{estudiante.nombres} {estudiante.apellidos}</strong>.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5 rounded-md border bg-white p-6 dark:bg-zinc-950 dark:border-zinc-800">
                    <InputField
                        id="cedula"
                        label="Cédula de Identidad"
                        value={data.cedula}
                        onChange={(v) => setData('cedula', v)}
                        error={errors.cedula}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            id="nombres"
                            label="Nombres"
                            value={data.nombres}
                            onChange={(v) => setData('nombres', v)}
                            error={errors.nombres}
                        />
                        <InputField
                            id="apellidos"
                            label="Apellidos"
                            value={data.apellidos}
                            onChange={(v) => setData('apellidos', v)}
                            error={errors.apellidos}
                        />
                    </div>

                    <InputField
                        id="correo"
                        label="Correo Electrónico"
                        type="email"
                        value={data.correo}
                        onChange={(v) => setData('correo', v)}
                        error={errors.correo}
                        hint="(Opcional)"
                    />

                    <div className="grid gap-1.5">
                        <label htmlFor="carrera_id" className="text-sm font-medium">Carrera</label>
                        <select
                            id="carrera_id"
                            value={data.carrera_id}
                            onChange={(e) => setData('carrera_id', e.target.value ? Number(e.target.value) : '')}
                            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-300"
                        >
                            <option value="">— Selecciona una carrera —</option>
                            {carreras.map((carrera) => (
                                <option key={carrera.id} value={carrera.id}>
                                    {carrera.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.carrera_id && <p className="text-xs text-red-500">{errors.carrera_id}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            href="/estudiantes"
                            className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center rounded-md bg-zinc-900 px-6 text-sm font-medium text-zinc-50 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            {processing ? 'Guardando…' : 'Actualizar Estudiante'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Estudiantes', href: '/estudiantes' },
        { title: 'Editar', href: '#' },
    ],
};
