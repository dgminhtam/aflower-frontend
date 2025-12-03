"use client";

import { UserResponse } from "@/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Mail } from "lucide-react";

interface UserProfileDisplayProps {
    user: UserResponse;
}

export function UserProfileDisplay({ user }: UserProfileDisplayProps) {
    return (
        <>
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-2xl">
                        {user.firstName}
                        {user.lastName}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
        </>
    );
}
