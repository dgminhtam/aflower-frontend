"use client";

import { UserResponse } from "@/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { SignOutButton } from "@clerk/nextjs";
import { Camera } from "lucide-react";

interface UserProfileDisplayProps {
    user: UserResponse;
}

export function UserProfileDisplay({ user }: UserProfileDisplayProps) {
    const displayName = user.firstName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0];

    return (
        <div className="flex items-start gap-6 mb-8">
            <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    <AvatarImage src={user.picture} alt={displayName} />
                    <AvatarFallback className="text-2xl">
                        {(displayName || "").charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-background shadow-sm"
                >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change avatar</span>
                </Button>
            </div>

            <div className="space-y-1 pt-2">
                <h2 className="text-xl font-semibold text-foreground">
                    {displayName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="pt-2">
                    <SignOutButton>
                        <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Logout
                        </Button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    );
}
