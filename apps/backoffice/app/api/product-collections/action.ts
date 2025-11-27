"use server"

import { fetchAuthenticated } from '@/app/api/auth/action';
import { ProductCollection, ProductCollectionResponse, ProductCollectionDetailResponse, CreateProductCollectionRequest, UpdateProductCollectionRequest } from '@/app/lib/product-collections/definitions';
import { URLSearchParams } from 'url';

const BASE_URL = '/product-collections';

export async function getProductCollections(searchParams: { [key: string]: string | string[] | undefined }): Promise<ProductCollectionResponse> {
    const { page = '0', size = '20', search = '' } = searchParams;
    const query = new URLSearchParams({
        page: String(page),
        size: String(size),
    });
    if (search) {
        query.append('search', String(search));
    }

    return await fetchAuthenticated<ProductCollectionResponse>(`${BASE_URL}?${query.toString()}`);
}

export async function getProductCollectionById(id: number): Promise<ProductCollectionDetailResponse> {
    return await fetchAuthenticated<ProductCollectionDetailResponse>(`${BASE_URL}/${id}`);
}

export async function createProductCollection(data: CreateProductCollectionRequest): Promise<ProductCollectionDetailResponse> {
    return await fetchAuthenticated<ProductCollectionDetailResponse>(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateProductCollection(id: number, data: UpdateProductCollectionRequest): Promise<ProductCollectionDetailResponse> {
    return await fetchAuthenticated<ProductCollectionDetailResponse>(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteProductCollection(id: number): Promise<void> {
    await fetchAuthenticated(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}

export async function addProductsToCollection(id: number, productIds: number[]): Promise<void> {
    await fetchAuthenticated(`${BASE_URL}/${id}/products`, {
        method: 'POST',
        body: JSON.stringify(productIds),
    });
}

export async function removeProductsFromCollection(id: number, productIds: number[]): Promise<void> {
    await fetchAuthenticated(`${BASE_URL}/${id}/products`, {
        method: 'DELETE',
        body: JSON.stringify(productIds),
    });
}
