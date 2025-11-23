import { BookOpen, GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react"

export const siteConfig = {
    teams: [
        {
            name: "Aflower",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Quản lý tài nguyên",
            url: "#",
            icon: SquareTerminal,
            items: [
                {
                    title: "Danh mục",
                    url: "/categories",
                },
                {
                    title: "Sản phẩm",
                    url: "/products",
                },
            ],
        },
        {
            title: "Tài liệu",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Media",
                    url: "/medias",
                },
            ],
        },
        {
            title: "Cấu hình",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Vận chuyển",
                    url: "#",
                },
                {
                    title: "Thanh toán",
                    url: "#",
                },
                {
                    title: "Email",
                    url: "#",
                },
            ],
        },
    ],
}
