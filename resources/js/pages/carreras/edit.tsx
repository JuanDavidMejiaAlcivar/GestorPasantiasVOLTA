import { Head, useForm, Link } from '@inertiajs/react';

interface Carrera {
    id: number;
    nombre: string;
    descripcion: string | null;
}

export default function Edit({ carrera }: { carrera: Carrera }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: carrera.nombre || '',
        descripcion: carrera.descripcion || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/carreras/${carrera.id}`);
    };

    return (
        <>
            <Head title="Editar Carrera" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div>
                    <h1 className="text-2xl font-semibold">Editar Carrera</h1>
                    <p className="text-sm text-gray-500">Modifica los datos de la carrera.</p>
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-col gap-5 rounded-md border bg-white p-6 dark:bg-zinc-950 dark:border-zinc-800"
                >
                    <div className="grid gap-2">
                        <label htmlFor="nombre" className="text-sm font-medium">
                            Nombre de la Carrera <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                        />
                        {errors.nombre && (
                            <span className="text-sm text-red-500">{errors.nombre}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="descripcion" className="text-sm font-medium">
                            Descripción <span className="text-zinc-400 font-normal">(Opcional)</span>
                        </label>
                        <textarea
                            id="descripcion"
                            rows={4}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                        />
                        {errors.descripcion && (
                            <span className="text-sm text-red-500">{errors.descripcion}</span>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            href="/carreras"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900/90 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
                        >
                            {processing ? 'Guardando...' : 'Actualizar Carrera'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Carreras', href: '/carreras' },
        { title: 'Editar', href: '#' },
    ],
};
