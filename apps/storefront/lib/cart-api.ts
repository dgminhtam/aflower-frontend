import { fetchPublic } from "./api";
import { AddToCartRequest, Cart, UpdateCartEmailRequest, UpdateCartEntryRequest } from "./definitions";

const CART_API_BASE = "/storefront/carts";

export const getCart = (link: string) => {
    return fetchPublic<Cart>(`${CART_API_BASE}?link=${link}`);
};

export const addToCart = (link: string, data: AddToCartRequest) => {
    return fetchPublic<Cart>(`${CART_API_BASE}/items?link=${link}`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateCartEntry = (link: string, entryId: number, data: UpdateCartEntryRequest) => {
    return fetchPublic<Cart>(`${CART_API_BASE}/entries/${entryId}?link=${link}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const removeCartEntry = (link: string, entryId: number) => {
    return fetchPublic<Cart>(`${CART_API_BASE}/entries/${entryId}?link=${link}`, {
        method: "DELETE",
    });
};

export const clearCart = (link: string) => {
    return fetchPublic<Cart>(`${CART_API_BASE}?link=${link}`, {
        method: "DELETE",
    });
};

export const updateCartEmail = (link: string, data: UpdateCartEmailRequest) => {
    return fetchPublic<Cart>(`${CART_API_BASE}/email?link=${link}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const checkoutCart = (link: string) => {
    return fetchPublic<Cart>(`${CART_API_BASE}/checkout?link=${link}`, {
        method: "POST",
    });
};
