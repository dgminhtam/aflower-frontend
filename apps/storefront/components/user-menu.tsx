"use client"

import { SignOutButton, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Heart, LogOut, Package, User as UserIcon } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
    const { isSignedIn, user } = useUser()

    if (!isSignedIn) {
        return (
            <Link href="/sign-in">
                <Button variant="ghost" size="icon">
                    <UserIcon className="h-5 w-5" />
                </Button>
            </Link>
        )
    }

    const userInitials = user.fullName
        ? user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : user.emailAddresses[0]?.emailAddress?.slice(0, 2).toUpperCase() || "U"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.emailAddresses[0]?.emailAddress}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Thông tin tài khoản</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Đơn hàng của tôi</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Danh sách yêu thích</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <SignOutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
