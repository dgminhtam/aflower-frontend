import { getUserProfile } from "@/lib/api";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Suspense } from "react";
import { UserProfileDisplay } from "@/components/profile/user-profile-display";

export default async function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>

                <Suspense fallback={<ProfileSkeleton />}>
                    <FetchUserData />
                </Suspense>
            </Card>
        </div>
    );
}

async function FetchUserData() {
    const user = await getUserProfile();

    return (
        <CardContent className="space-y-6">
            <UserProfileDisplay user={user} />
        </CardContent>
    );
}

function ProfileSkeleton() {
    return (
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
    );
}
