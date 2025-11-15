import { fetchAuthenticated } from '@/app/api/auth/action';
import { SearchParams } from '@/app/lib/definitions';
import { Product, ProductResponse } from '@/app/lib/products/definitions';
import { queryParamsToString } from '@/app/lib/utils';

export const getProducts = (searchParams: SearchParams) =>
  fetchAuthenticated<ProductResponse>(`/products?${queryParamsToString(searchParams)}`);

export const getProductById = (id: number) =>
  fetchAuthenticated<Product>(`/products/${id}`);