import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-primary">Aflower</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Chúng tôi mang đến những đóa hoa tươi thắm và những chiếc bánh ngọt ngào nhất để bạn trao gửi yêu thương đến người thân.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Liên kết nhanh</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-primary transition-colors">Tin tức</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">Liên hệ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/policy/shipping" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link>
                            </li>
                            <li>
                                <Link href="/policy/return" className="hover:text-primary transition-colors">Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link href="/policy/privacy" className="hover:text-primary transition-colors">Bảo mật thông tin</Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Liên hệ</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                                <span>123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-primary" />
                                <span>1900 123 456</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-primary" />
                                <span>contact@aflower.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Aflower. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
