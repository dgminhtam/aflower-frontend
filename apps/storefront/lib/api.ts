import { Category, ProductResponse, SearchParams, Product, Page, ProductCollection, ProductCollectionDetailResponse, BlogPostListResponse, BlogPost } from "./definitions";

const API_TIMEOUT_MS = 10000;

async function apiFetch<T>(
    urlPath: string,
    options: RequestInit = {},
    timeoutMs = API_TIMEOUT_MS
): Promise<T> {

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!BASE_URL) {
        throw new Error("Thiếu biến môi trường NEXT_PUBLIC_API_BASE_URL");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const defaultOptions: RequestInit = {
        method: 'GET',
        headers: defaultHeaders,
        cache: 'no-store',
        signal: controller.signal,
    };

    const finalOptions: RequestInit = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultHeaders,
            ...((options.headers || {}) as Record<string, string>),
        },
    };

    const fullUrl = `${BASE_URL}${urlPath}`;
    console.log(`Fetching: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl, finalOptions);
        clearTimeout(timeout);

        if (!response.ok) {
            const errorJson = await response.json().catch(() => ({}));
            throw new Error(errorJson.message || `Lỗi API: ${response.status}`);
        }

        if (response.status === 204) {
            return null as T;
        }

        const text = await response.text();
        if (!text) {
            return null as T;
        }

        const data: T = JSON.parse(text);
        return data;

    } catch (error) {
        clearTimeout(timeout);
        console.error("Lỗi apiFetch:", error);
        throw error;
    }
}

export async function fetchPublic<T>(
    urlPath: string,
    options: RequestInit = {}
): Promise<T> {
    return apiFetch<T>(urlPath, options);
}

export const queryParamsToString = (params: SearchParams): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                value.forEach((v) => searchParams.append(key, v));
            } else {
                searchParams.append(key, String(value));
            }
        }
    });
    return searchParams.toString();
};

export const getProducts = (searchParams: SearchParams) => {
    const queryString = queryParamsToString(searchParams);
    return fetchPublic<ProductResponse>(`/storefront/products?${queryString}`);
};

export const getCategories = () => {
    return fetchPublic<Category[]>(`/storefront/categories`);
};

export const getCategoriesTree = () => {
    return fetchPublic<Category[]>(`/storefront/categories/tree`);
};

export const getRootCategories = () => {
    return fetchPublic<Category[]>("/storefront/categories/root");
};

export const getProductBySlug = (slug: string) => {
    return fetchPublic<Product>(`/storefront/products/${slug}`);
};

export const getProductBySku = (sku: string) => {
    return fetchPublic<Product>(`/storefront/products/${sku}`);
};

export const getProductCollections = (searchParams: SearchParams) => {
    const queryString = queryParamsToString(searchParams);
    return fetchPublic<Page<ProductCollection>>(`/storefront/product-collections?${queryString}`);
};

export const getProductCollectionBySlug = (slug: string) => {
    return fetchPublic<ProductCollectionDetailResponse>(`/storefront/product-collections/${slug}`);
};

export const getBlogs = (searchParams: SearchParams) => {
    const queryString = queryParamsToString(searchParams);
    return fetchPublic<Page<BlogPostListResponse>>(`/storefront/blogs?${queryString}`);
};

export const getBlogBySlug = (slug: string) => {
    return fetchPublic<BlogPost>(`/storefront/blogs/${slug}`);
};
