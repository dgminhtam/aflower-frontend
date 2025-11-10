"use server"

import { URLSearchParams } from 'url';
import { CategoryResponse, Category, Media, CreateCategoryRequest, UpdateCategoryRequest } from '@/app/lib/categories/definitions';
import { buildFilterQuery, buildSortQuery } from '../utils';
import { fetchAuthenticated } from '../auth/action';

export async function getCategories(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<CategoryResponse> {

  const {
    page: humanPage = '1',
    size = '10',
    sort = '',
    ...searchFields
  } = searchParams;

  const pageNumber = Number(humanPage);
  const pageIndex = pageNumber > 0 ? pageNumber - 1 : 0;

  const query = new URLSearchParams({
    page: String(pageIndex),
    size: String(size),
  });

  const sortArray = buildSortQuery(sort);
  sortArray.forEach(s => {
    query.append('sort', `${s.field}_${s.direction}`);
  });

  const filterQuery = buildFilterQuery(searchFields);
  if (filterQuery) {
    query.append('$filter', filterQuery);
  }

  const fullUrl = `/categories?${query.toString()}`;

  try {
    const data = await fetchAuthenticated<CategoryResponse>(fullUrl); 
    return data;
  } catch (error) {
    return {
      content: [],
      pageable: {
        pageNumber: 0,
        pageSize: Number(size),
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalElements: 0,
      totalPages: 0,
      size: Number(size),
      number: 0,
      first: true,
      numberOfElements: 0,
      empty: true,
    };
  }
}

export async function getCategoryTree(): Promise<Category[]> {
  const fullUrl = `/categories/tree`;
  return await fetchAuthenticated<Category[]>(fullUrl);
}

export async function getCategoryById(id: number): Promise<Category> {
  const fullUrl = `/categories/${id}`;
  return await fetchAuthenticated<Category>(fullUrl);
}

export async function createCategory(request: CreateCategoryRequest): Promise<Category> {
  const fullUrl = "/categories";
  return await fetchAuthenticated<Category>(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

export async function updateCategory(id: number, request: UpdateCategoryRequest): Promise<Category> {
  const fullUrl = `/categories/${id}`;
  return await fetchAuthenticated<Category>(fullUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}