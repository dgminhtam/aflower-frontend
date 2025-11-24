import { Truck, ShieldCheck, RefreshCw, PhoneCall } from "lucide-react"

const FEATURES = [
    {
        icon: Truck,
        title: "Giao hàng nhanh chóng",
        description: "Vận chuyển trong 2h nội thành",
    },
    {
        icon: ShieldCheck,
        title: "Cam kết chất lượng",
        description: "Hoa tươi mới mỗi ngày",
    },
    {
        icon: RefreshCw,
        title: "Đổi trả dễ dàng",
        description: "Trong vòng 24h nếu lỗi",
    },
    {
        icon: PhoneCall,
        title: "Hỗ trợ 24/7",
        description: "Hotline: 1900 123 456",
    },
]

export function FeatureBar() {
    return (
        <div className="bg-muted/50 py-8 border-y">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
