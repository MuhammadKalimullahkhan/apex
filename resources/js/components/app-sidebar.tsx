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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Bell, Building, Clipboard, LayoutGrid, Shield, ThermometerSnowflake, Ticket, Users, Users2 } from 'lucide-react';
import { useRoute } from 'ziggy-js';
import AppLogo from './app-logo';
import employees from '@/routes/employees';
import roles from '@/routes/roles';
import companies from '@/routes/companies';
import clients from '@/routes/clients';
import projects from '@/routes/projects';
import tasks from '@/routes/tasks';
import expenses from '@/routes/expenses';
import invoices from '@/routes/invoices';
import notificationsTypes from '@/routes/notifications-types';
import notifications from '@/routes/notifications';


export function AppSidebar() {
    const route = useRoute();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
            allow: ['Admin','Project Manager','Developer','HR','Employee','Client'],
        },
        {
            title: 'Employees',
            href: employees.index(),
            icon: Users,
            allow: ['Admin','HR'],
        },
        {
            title: 'Roles',
            href: roles.index(),
            icon: Shield,
            allow: ['Admin'],
        },
        {
            title: 'Companies',
            href: companies.index(),
            icon: Building,
            allow: ['Admin','HR'],
        },
        {
            title: 'Clients',
            href: clients.index(),
            icon: Users2,
            allow: ['Admin','Project Manager'],
        },
        {
            title: 'Projects',
            href: projects.index(),
            icon: Clipboard,
            allow: ['Admin','Project Manager'],
        },
        {
            title: 'Tasks',
            href: tasks.index(),
            icon: ThermometerSnowflake,
            allow: ['Admin','Project Manager','Developer'],
        },
        {
            title: 'Expenses',
            href: expenses.index(),
            icon: ThermometerSnowflake,
            allow: ['Admin','HR'],
        },
        {
            title: 'Invoices',
            href: invoices.index(),
            icon: ThermometerSnowflake,
            allow: ['Admin'],
        },
        {
            title: 'Notification Types',
            href: notificationsTypes.index(),
            icon: Bell,
            allow: ['Admin'],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Notifications',
            href: notifications.index(),
            icon: Bell,
        }
    ];


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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
