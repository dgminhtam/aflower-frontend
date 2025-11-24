"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                {/* Top Bar */}
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary font-serif italic">Aflower</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-primary">
                            Trang chủ
                        </Link>
                        <Link href="/products" className="transition-colors hover:text-primary">
                            Sản phẩm
                        </Link>
                        <Link href="/categories/hoa-tuoi" className="transition-colors hover:text-primary">
                            Hoa tươi
                        </Link>
                        <Link href="/categories/banh-kem" className="transition-colors hover:text-primary">
                            Bánh kem
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-primary">
                            Về chúng tôi
                        </Link>
                        <Link href="/contact" className="transition-colors hover:text-primary">
                            Liên hệ
                        </Link>
                    </nav>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden md:flex relative w-64">
                            <Input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="pr-8 rounded-full bg-muted/50 border-none focus-visible:ring-1"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                                <Search className="h-5 w-5 md:hidden" />
                                <Heart className="h-5 w-5 hidden md:block" />
                            </Button>
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                    0
                                </span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <div className="relative">
                        <Input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="w-full"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <nav className="flex flex-col space-y-3">
                        <Link href="/" className="text-sm font-medium hover:text-primary">
                            Trang chủ
                        </Link>
                        <Link href="/products" className="text-sm font-medium hover:text-primary">
                            Sản phẩm
                        </Link>
                        <Link href="/categories/hoa-tuoi" className="text-sm font-medium hover:text-primary">
                            Hoa tươi
                        </Link>
                        <Link href="/categories/banh-kem" className="text-sm font-medium hover:text-primary">
                            Bánh kem
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-primary">
                            Về chúng tôi
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
