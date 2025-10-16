import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: Employee;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    allow?: string[]; // optional role whitelist for client-side guards
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// M O D E L S
interface Role {
    role_id: number
    role_name: string
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: boolean | string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    role?: Role

    [key: string]: unknown; // This allows for additional properties...
}

// P A G I N A T I O N
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}