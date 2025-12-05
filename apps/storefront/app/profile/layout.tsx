import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { UserProfile } from "@clerk/nextjs";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tài khoản</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <ProfileSidebar />
                </aside>
                <main className="flex-1">
                    <UserProfile path="/user-profile" routing="path" />
                    {children}
                </main>
            </div>
        </div>
    );
}
