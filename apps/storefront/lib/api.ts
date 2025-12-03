"use server"

import { auth } from "@clerk/nextjs/server";
import { Category, ProductResponse, SearchParams, Product, Page, ProductCollection, ProductCollectionDetailResponse, BlogPostListResponse, BlogPost, UserResponse } from "./definitions";

const API_TIMEOUT_MS = 10000;

export async function getClerkToken(): Promise<string> {
    const { getToken, userId } = await auth();
    if (!userId) {
        throw new Error('Chưa xác thực (User ID not found)');
    }
    const token = await getToken();
    if (!token) {
        throw new Error('Không lấy được token (getToken failed)');
    }
    console.log(token)
    return token;
}

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

export async function fetchAuthenticated<T>(
    urlPath: string,
    options: RequestInit = {}
): Promise<T> {

    const token = await getClerkToken();

    const authHeaders: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    };

    const finalOptions: RequestInit = {
        ...options,
        headers: {
            ...authHeaders,
            ...((options.headers || {}) as Record<string, string>),
        },
    };

    return apiFetch<T>(urlPath, finalOptions);
}

const queryParamsToString = (params: SearchParams): string => {
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

export const getProducts = async (searchParams: SearchParams) => {
    const queryString = queryParamsToString(searchParams);
    return fetchPublic<ProductResponse>(`/storefront/products?${queryString}`);
};

export const getCategories = async () => {
    return fetchPublic<Category[]>(`/storefront/categories`);
};

export const getCategoriesTree = async () => {
    return fetchPublic<Category[]>(`/storefront/categories/tree`);
};

export const getRootCategories = async () => {
    return fetchPublic<Category[]>("/storefront/categories/root");
};

export const getProductBySlug = async (slug: string) => {
    return fetchPublic<Product>(`/storefront/products/${slug}`);
};

export const getProductBySku = async (sku: string) => {
    return fetchPublic<Product>(`/storefront/products/${sku}`);
};

export const getProductCollections = async (searchParams: SearchParams) => {
    const queryString = queryParamsToString(searchParams);
    return fetchPublic<Page<ProductCollection>>(`/storefront/product-collections?${queryString}`);
};

export const getProductCollectionBySlug = async (slug: string) => {
    return fetchPublic<ProductCollectionDetailResponse>(`/storefront/product-collections/${slug}`);
};

export const getBlogs = async (searchParams: SearchParams) => {
    const queryString = queryParamsToString(searchParams);
    return fetchPublic<Page<BlogPostListResponse>>(`/storefront/blogs?${queryString}`);
};

export const getBlogBySlug = async (slug: string) => {
    return fetchPublic<BlogPost>(`/storefront/blogs/${slug}`);
};

export const getUserProfile = async () => {
    return fetchAuthenticated<UserResponse>(`/storefront/users/profile`);
};
