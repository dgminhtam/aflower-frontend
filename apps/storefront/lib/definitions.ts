
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
