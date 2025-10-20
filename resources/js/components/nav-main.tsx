import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import RoleGuard from '@/gaurds/role-gaurd';
import PermissionGuard from '@/gaurds/permission-gaurd';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    // <RoleGuard key={item.title} allow={item.allow ?? ['Admin','Project Manager','Developer','HR','Employee','Client']}>
                    <PermissionGuard key={item.title} permission={item.permission}>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(item.href.url)}
                                tooltip={{ children: item.title }}
                                >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </PermissionGuard>
                    // </RoleGuard>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
