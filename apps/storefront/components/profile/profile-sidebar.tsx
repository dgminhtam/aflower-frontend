"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { LayoutDashboard, ShoppingBag, MapPin, User, Heart } from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/profile",
        icon: LayoutDashboard,
    },
    {
        title: "My Orders",
        href: "/profile/orders",
        icon: ShoppingBag,
    },
    {
        title: "Edit Address",
        href: "/profile/address",
        icon: MapPin,
    },
    {
        title: "Edit Account",
        href: "/profile/account",
        icon: User,
    },
    {
        title: "Yêu thích",
        href: "/profile/wishlist",
        icon: Heart,
    },
];

export function ProfileSidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col space-y-1">
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
