"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Fragment } from "react"

const ROUTE_MAPPING: Record<string, string> = {
    products: "Sản phẩm",
    contact: "Liên hệ",
    about: "Về chúng tôi",
    cart: "Giỏ hàng",
    checkout: "Thanh toán",
    "sign-in": "Đăng nhập",
    "sign-up": "Đăng ký",
}

export function StorefrontBreadcrumb() {
    const pathname = usePathname()

    if (pathname === "/") {
        return null
    }

    const segments = pathname.split("/").filter(Boolean)

    return (
        <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Trang chủ</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {segments.map((segment, index) => {
                        const isLast = index === segments.length - 1
                        const href = `/${segments.slice(0, index + 1).join("/")}`
                        const label = ROUTE_MAPPING[segment] || segment

                        return (
                            <Fragment key={href}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={href}>{label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </Fragment>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}
