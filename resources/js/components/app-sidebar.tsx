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
import { Bell, Building, Clipboard, DollarSign, LayoutGrid, Paperclip, Shield, ThermometerSnowflake, Ticket, TrendingUp, Users, Users2, BarChart3 } from 'lucide-react';
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
import { routes } from '@/constants/routes';
import reports from '@/routes/reports';


export function AppSidebar() {
    const route = useRoute();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
            permission: 'dashboard.index'
        },
        {
            title: 'Employees',
            href: employees.index(),
            icon: Users,
            permission: routes.employees.index
        },
        {
            title: 'Roles',
            href: roles.index(),
            icon: Shield,
            permission: routes.roles.index
        },
        {
            title: 'Companies',
            href: companies.index(),
            icon: Building,
            permission: routes.companies.index
        },
        {
            title: 'Clients',
            href: clients.index(),
            icon: Users2,
            permission: routes.clients.index
        },
        {
            title: 'Projects',
            href: projects.index(),
            icon: Clipboard,
            permission: routes.projects.index
        },
        {
            title: 'Tasks',
            href: tasks.index(),
            icon: ThermometerSnowflake,
            permission: routes.tasks.index
        },
        {
            title: 'Expenses',
            href: expenses.index(),
            icon: DollarSign,
            permission: routes.employees.index
        },
        {
            title: 'Invoices',
            href: invoices.index(),
            icon: Paperclip,
            permission: routes.invoices.index
        },
        {
            title: 'Notification Types',
            href: notificationsTypes.index(),
            icon: Bell,
            permission: routes.notificationsTypes.index
        },
    ];

    const reportsNavItems: NavItem[] = [
        {
            title: 'Financial',
            href: reports.financial.index(),
            icon: BarChart3,
            permission: 'reports.financial.index'
        },
        {
            title: 'Projects',
            href: reports.projects.index(),
            icon: TrendingUp,
            permission: 'reports.projects.index'
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Notifications',
            href: notifications.index(),
            icon: Bell,
            permission: routes.notifications.index
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
                <NavMain items={mainNavItems} reports={reportsNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
