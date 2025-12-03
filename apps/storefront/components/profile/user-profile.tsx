"use client";

import { getUserProfile } from "@/lib/api";
import { UserResponse } from "@/lib/definitions";
import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { AlertCircle, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

export function UserProfile() {
    const { getToken } = useAuth();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getUserProfile();
            setUser(data);
        } catch (err) {
            console.error("Lỗi khi tải thông tin người dùng:", err);
            setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải thông tin");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Loading State
    if (loading) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Error State
    if (error) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="rounded-full bg-destructive/10 p-3">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Không thể tải thông tin</h3>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                        <Button onClick={fetchUserProfile} variant="outline">
                            Thử lại
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Empty State (unlikely but handled)
    if (!user) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Không tìm thấy thông tin</h3>
                            <p className="text-sm text-muted-foreground">
                                Không có dữ liệu người dùng
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Success State
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-2xl">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
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
            </CardContent>
        </Card>
    );
}
