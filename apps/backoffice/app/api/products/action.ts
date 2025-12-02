import { UpdateProductRequest } from '@/app/(main)/products/[id]/update-product-form';
import { CreateProductRequest } from '@/app/(main)/products/create/create-product-form';
import { fetchAuthenticated } from '@/app/api/auth/action';
import { SearchParams } from '@/app/lib/definitions';
import { Product, ProductResponse } from '@/app/lib/products/definitions';
import { queryParamsToString } from '@/app/lib/utils';

export const getProducts = (searchParams: SearchParams) =>
  fetchAuthenticated<ProductResponse>(`/products?${queryParamsToString(searchParams)}`);

export const getProductById = (id: number) =>
  fetchAuthenticated<Product>(`/products/${id}`);

export const createProduct = (request: CreateProductRequest): Promise<Product> => fetchAuthenticated<Product>("/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(request),
});

export const updateProduct = (id: number, request: UpdateProductRequest): Promise<Product> => fetchAuthenticated<Product>(`/products/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(request),
});

export const importProducts = async (formData: FormData): Promise<void> => {
  await fetchAuthenticated<void>("/products/import", {
    method: "POST",
    body: formData,
  });
};

export const addAlternativeProduct = (id: number, alternativeId: number): Promise<void> =>
  fetchAuthenticated<void>(`/products/${id}/alternatives/${alternativeId}`, {
    method: "POST",
  });

export const removeAlternativeProduct = (id: number, alternativeId: number): Promise<void> =>
  fetchAuthenticated<void>(`/products/${id}/alternatives/${alternativeId}`, {
    method: "DELETE",
  });