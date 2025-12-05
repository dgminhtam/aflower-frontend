"use client";

import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
    return (
        <div className="flex justify-center w-full">
            <UserProfile
                path="/profile/account"
                routing="path"
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "w-full shadow-sm border border-border"
                    }
                }}
            />
        </div>
    );
}
