import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    BookOpenText,
    Building2,
    FileText,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage<any>();
    const user = page.props.auth.user;
    const role = user?.role || 'user';

    // Construir items según el rol
    const navItems: NavItem[] = [];

    // Dashboard para todos
    navItems.push({
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    });

    // Admin: Estudiantes y Carreras
    if (role === 'admin') {
        navItems.push({
            title: 'Estudiantes',
            href: '/estudiantes',
            icon: GraduationCap,
        });
        navItems.push({
            title: 'Carreras',
            href: '/carreras',
            icon: BookOpenText,
        });
    }

    // Pasantías: visible para todos (admin, estudiante, usuario corriente)
    navItems.push({
        title: 'Pasantías',
        href: '/lugares',
        icon: Building2,
    });

    // Solicitudes: solo admin y estudiante
    if (role === 'admin' || role === 'estudiante') {
        navItems.push({
            title: 'Solicitudes',
            href: '/solicitudes',
            icon: FileText,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
