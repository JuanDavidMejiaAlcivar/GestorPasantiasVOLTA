import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p>Módulo principal del sistema de gestión de pasantías.</p>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Estudiantes',
            href: '/estudiantes',
        },
    ],
};
