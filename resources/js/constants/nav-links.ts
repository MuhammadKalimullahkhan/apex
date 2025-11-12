import { type NavItem } from '@/types';
import { Bell, Building, Clipboard, LayoutGrid, Shield, ThermometerSnowflake, Ticket, Users, Users2 } from 'lucide-react';
import { dashboard } from '@/routes';
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

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        allow: ['Admin','Project Manager','Developer','HR','Employee','Client'],
        permission: 'dashboard.index'
    },
    {
        title: 'Employees',
        href: employees.index(),
        icon: Users,
        allow: ['Admin','HR'],
        permission: routes.employees.index
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: Shield,
        allow: ['Admin', 'Project Manager'],
        permission: routes.roles.index
    },
    {
        title: 'Companies',
        href: companies.index(),
        icon: Building,
        allow: ['Admin','HR'],
        permission: routes.companies.index
    },
    {
        title: 'Clients',
        href: clients.index(),
        icon: Users2,
        allow: ['Admin','Project Manager'],
        permission: routes.clients.index
    },
    {
        title: 'Projects',
        href: projects.index(),
        icon: Clipboard,
        allow: ['Admin','Project Manager'],
        permission: routes.projects.index
    },
    {
        title: 'Tasks',
        href: tasks.index(),
        icon: ThermometerSnowflake,
        allow: ['Admin','Project Manager','Developer'],
        permission: routes.tasks.index
    },
    {
        title: 'Expenses',
        href: expenses.index(),
        icon: ThermometerSnowflake,
        allow: ['Admin','HR'],
        permission: routes.employees.index
    },
    {
        title: 'Invoices',
        href: invoices.index(),
        icon: ThermometerSnowflake,
        allow: ['Admin'],
        permission: routes.invoices.index
    },
    {
        title: 'Notification Types',
        href: notificationsTypes.index(),
        icon: Bell,
        allow: ['Admin'],
        permission: routes.notificationsTypes.index
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Notifications',
        href: notifications.index(),
        icon: Bell,
        permission: routes.notifications.index
    }
];
