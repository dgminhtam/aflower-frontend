import { getUserProfile } from "@/lib/api";
import { UserProfileDisplay } from "@/components/profile/user-profile-display";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default async function ProfilePage() {
    const user = await getUserProfile();

    if (!user) return null;

    const displayName = user.firstName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0];

    return (
        <div>
            <UserProfileDisplay user={user} />

            <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                    Xin chào <span className="font-medium text-foreground">{displayName}</span> (không phải <span className="font-medium text-foreground">{displayName}</span>? <SignOutButton><button className="text-primary hover:underline font-medium">Đăng xuất</button></SignOutButton>)
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    Từ bảng điều khiển tài khoản của bạn, bạn có thể xem các <Link href="/profile/orders" className="text-primary hover:underline">đơn hàng gần đây</Link>,
                    quản lý <Link href="/profile/address" className="text-primary hover:underline">địa chỉ giao hàng và thanh toán</Link> của mình,
                    và <Link href="/profile/account" className="text-primary hover:underline">chỉnh sửa mật khẩu và chi tiết tài khoản</Link>.
                </p>
            </div>
        </div>
    );
}
