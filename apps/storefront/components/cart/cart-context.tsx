"use client";

import { AddToCartRequest, Cart, UpdateCartEntryRequest } from "@/lib/definitions";
import * as CartAPI from "@/lib/cart-api";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    addToCart: (item: AddToCartRequest) => Promise<void>;
    updateQuantity: (entryId: number, quantity: number) => Promise<void>;
    removeItem: (entryId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getCartLink = () => {
        if (typeof window === "undefined") return "";
        let link = localStorage.getItem("cartLink");
        if (!link) {
            link = uuidv4();
            localStorage.setItem("cartLink", link);
        }
        return link;
    };

    const refreshCart = async () => {
        const link = getCartLink();
        if (!link) return;

        try {
            const data = await CartAPI.getCart(link);
            setCart(data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const addToCart = async (item: AddToCartRequest) => {
        const link = getCartLink();
        if (!link) return;

        setIsLoading(true);
        try {
            const updatedCart = await CartAPI.addToCart(link, item);
            setCart(updatedCart);
            setIsOpen(true);
            toast.success("Đã thêm vào giỏ hàng!");
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error("Lỗi khi thêm vào giỏ hàng");
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (entryId: number, quantity: number) => {
        const link = getCartLink();
        if (!link) return;

        setIsLoading(true);
        try {
            const updatedCart = await CartAPI.updateCartEntry(link, entryId, { quantity });
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to update quantity:", error);
            toast.error("Lỗi cập nhật số lượng");
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (entryId: number) => {
        const link = getCartLink();
        if (!link) return;

        setIsLoading(true);
        try {
            const updatedCart = await CartAPI.removeCartEntry(link, entryId);
            setCart(updatedCart);
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (error) {
            console.error("Failed to remove item:", error);
            toast.error("Lỗi xóa sản phẩm");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                addToCart,
                updateQuantity,
                removeItem,
                refreshCart,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
