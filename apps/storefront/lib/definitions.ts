
export interface Media {
    id: number;
    url: string;
    urlSmall: string;
    urlMedium: string;
    urlLarge: string;
    type: "IMAGE" | "VIDEO";
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parentId?: number;
    children?: Category[];
    image: Media;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originPrice: number;
    categories: Category[];
    image: Media;
    gallery: Media[];
}

export interface Page<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
    number: number;
    numberOfElements: number;
}

export type ProductResponse = Page<Product>;

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

// Cart Types
export interface CartEntry {
    id: number;
    sku: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    subTotal: number;
    imageUrl?: string;
}

export interface Cart {
    id: number;
    email?: string | null;
    link: string;
    subTotal: number;
    grandTotal: number;
    totalItems: number;
    entries: CartEntry[];
    createDate: string;
    lastModifiedDate: string;
}

export interface AddToCartRequest {
    sku: string;
    quantity: number;
    description?: string;
}

export interface UpdateCartEntryRequest {
    quantity: number;
}

export interface UpdateCartEmailRequest {
    email: string;
}

