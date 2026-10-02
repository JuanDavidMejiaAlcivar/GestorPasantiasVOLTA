import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Building2, GraduationCap, Send, ShieldCheck, Users } from 'lucide-react';

export default function Dashboard() {
    const page = usePage<any>();
    const user = page.props.auth.user;
    const role = user?.role || 'user';

    const getRoleTitle = () => {
        if (role === 'admin') return 'Administrador';
        if (role === 'estudiante') return 'Estudiante';
        return 'Usuario Invitado';
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
                {/* Header / Welcome Section */}
                <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {getRoleTitle()}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        ¡Hola, {user?.name || 'Usuario'}!
                    </h1>
                    <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-3xl">
                        Bienvenido al <strong className="text-zinc-700 dark:text-zinc-300">Gestor de Pasantías</strong>. 
                        Esta plataforma está diseñada para conectar el talento académico con oportunidades profesionales. 
                        Aquí facilitamos el proceso de búsqueda, solicitud y asignación de prácticas pre-profesionales en diversas empresas.
                    </p>
                </div>

                {/* Features / Explanation Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* Card 1: Lugares */}
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Directorio de Empresas</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Explora una lista actualizada de instituciones y empresas dispuestas a recibir pasantes, revisa sus cupos disponibles y las carreras que prefieren.
                        </p>
                    </div>

                    {/* Card 2: Solicitudes (Varía por rol) */}
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {role === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            {role === 'admin' ? 'Gestión Centralizada' : 'Proceso Simple'}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {role === 'admin' 
                                ? 'Administra las solicitudes entrantes, aprueba o rechaza peticiones y mantén el control total sobre las asignaciones de estudiantes.' 
                                : role === 'estudiante' 
                                    ? 'Encuentra la empresa ideal y envía tu solicitud de cupo con un solo clic. Da seguimiento al estado de tu petición desde tu panel.'
                                    : 'Los estudiantes registrados pueden solicitar cupos directamente a través de la plataforma para iniciar su proceso de vinculación.'}
                        </p>
                    </div>

                    {/* Card 3: Estudiantes/Carreras */}
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Organización Académica</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {role === 'admin'
                                ? 'Mantén un registro detallado de los estudiantes y las carreras disponibles en la institución para una mejor vinculación.'
                                : 'Todo el sistema está estructurado alrededor de los perfiles académicos para asegurar que cada pasante encuentre el lugar adecuado para su especialidad.'}
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
