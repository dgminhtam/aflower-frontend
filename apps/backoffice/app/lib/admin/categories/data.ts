import { URLSearchParams } from 'url';
import { CategoryResponse } from '@/app/lib/admin/categories/definitions';
import { buildFilterQuery, buildSortQuery } from '@/app/lib/admin/utils';

const API_TIMEOUT_MS = 10000;

function getEmptyCategoryResponse(size: number): CategoryResponse {
  return {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: size,
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalElements: 0,
    totalPages: 0,
    size,
    number: 0,
    first: true,
    numberOfElements: 0,
    empty: true,
  };
}

async function fetchWithTimeout<T>(
  url: string,
  token: string,
  timeoutMs = API_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`API rejected request: ${response.status} ${response.statusText}`);
  }

  const data: T = await response.json();
  return data;
}

export async function getCategories(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<CategoryResponse> {

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('Thiếu biến môi trường API_BASE_URL');
  }

  const {
    page: humanPage = '1',
    size = '10',
    sort = '',
    ...searchFields
  } = searchParams;

  const pageNumber = Number(humanPage);
  const backendPageIndex = pageNumber > 0 ? pageNumber - 1 : 0;

  const query = new URLSearchParams({
    page: String(backendPageIndex),
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

  const fullUrl = `${baseUrl.replace(/\/+$/, '')}/categories?${query.toString()}`;

  try {
    const data = await fetchWithTimeout<CategoryResponse>(fullUrl, "token");
    return data;
  } catch (error) {
    console.error('Lỗi gọi API (getCategories):', { url: fullUrl, error });
    return getEmptyCategoryResponse(Number(size));
  }
}