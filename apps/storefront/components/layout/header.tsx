"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Search, ShoppingCart, Menu, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { UserMenu } from "@/components/user-menu"
import { CategoryMenu } from "./category-menu"
import { GlobalSearch } from "./global-search"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                {/* Top Bar */}
                <div className="flex h-20 items-center justify-between gap-4">
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
                        <span className="text-3xl font-bold text-primary">Aflower</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-base font-medium h-full">
                        <Link href="/" className="transition-colors hover:text-primary">
                            TRANG CHỦ
                        </Link>
                        <CategoryMenu />
                        <Link href="/contact" className="transition-colors hover:text-primary">
                            LIÊN HỆ
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-primary">
                            VỀ CHÚNG TÔI
                        </Link>
                    </nav>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden md:block w-64">
                            <GlobalSearch />
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
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <div className="relative">
                        <GlobalSearch />
                    </div>
                    <nav className="flex flex-col space-y-3">
                        <Link href="/" className="text-sm font-medium hover:text-primary">
                            TRANG CHỦ
                        </Link>
                        <Link href="/products" className="text-sm font-medium hover:text-primary">
                            SẢN PHẨM
                        </Link>
                        <Link href="/contact" className="text-sm font-medium hover:text-primary">
                            LIÊN HỆ
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-primary">
                            VỀ CHÚNG TÔI
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
