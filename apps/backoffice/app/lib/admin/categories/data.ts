"use server"

import { auth } from '@clerk/nextjs/server';
import { URLSearchParams } from 'url';
// Giả định các định nghĩa này tồn tại
import { CategoryResponse, Category, Media, CreateCategoryRequest } from '@/app/lib/admin/categories/definitions';
import { buildFilterQuery, buildSortQuery } from '@/app/lib/admin/utils';

const API_TIMEOUT_MS = 10000;

// --- Hàm Utility ---

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

/**
 * Hàm gọi fetch với timeout và hỗ trợ tùy chỉnh method/body.
 * * @param url URL API.
 * @param token JWT token.
 * @param options Tùy chọn fetch (bao gồm method, body, headers khác).
 * @param timeoutMs Thời gian timeout (mặc định 10 giây).
 * @returns Promise chứa dữ liệu trả về từ API.
 */
async function fetchWithTimeout<T>(
  url: string,
  token: string,
  options: RequestInit = {}, // Cho phép truyền method, body, ...
  timeoutMs = API_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Tùy chọn mặc định
  const defaultOptions: RequestInit = {
    // Mặc định là GET nếu không được chỉ định
    method: 'GET', 
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: controller.signal,
  };

  // Gộp các tùy chọn. Headers và các tùy chọn khác được gộp/ghi đè.
  const finalOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: { 
      ...(defaultOptions.headers as Record<string, string>),
      ...((options.headers || {}) as Record<string, string>),
    },
  };

  const response = await fetch(url, finalOptions);

  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API rejected request: ${response.status} ${response.statusText} ${errorText}`);
  }

  const data: T = await response.json();
  return data;
}

export async function getToken(): Promise<string> {
  const { getToken, userId } = await auth();
  if (!userId) {
    throw new Error('Chưa xác thực');
  }
  const token = await getToken({ template: 'aflower' });
  if (!token) {
    throw new Error('Không lấy được token');
  }
  console.log(token);
  return token;
}

export async function getCategories(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<CategoryResponse> {
  const token = await getToken();

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
    // Không cần truyền options, mặc định là GET
    const data = await fetchWithTimeout<CategoryResponse>(fullUrl, token); 
    return data;
  } catch (error) {
    console.error('Lỗi gọi API (getCategories):', { url: fullUrl, error });
    return getEmptyCategoryResponse(Number(size));
  }
}

export async function getCategoryTree(): Promise<Category[]> {
  const token = await getToken();
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('Thiếu biến môi trường API_BASE_URL');
  }
  const fullUrl = `${baseUrl.replace(/\/+$/, '')}/categories/tree`;
  try {
    // Không cần truyền options, mặc định là GET
    const data = await fetchWithTimeout<Category[]>(fullUrl, token);
    return data;
  } catch (error) {
    console.error('Lỗi gọi API (getCategories):', { url: fullUrl, error });
    throw error;
  }
}

export async function uploadMedia(fileData: FormData): Promise<Media> {
  const token = await getToken();
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('Thiếu biến môi trường API_BASE_URL');
  }
  const fullUrl = `${baseUrl.replace(/\/+$/, '')}/medias/upload`;
  try {
    // 🚨 Đã thêm options để chỉ định method là POST và truyền body
    const data = await fetchWithTimeout<Media>(
      fullUrl, 
      token, 
      { 
        method: 'POST',
        body: fileData,
        // Khi dùng FormData, bạn không cần thiết lập 'Content-Type',
        // trình duyệt sẽ tự đặt Boundary cho 'multipart/form-data'.
      }
    );
    return data;
  } catch (error) {
    console.error('Lỗi gọi API (uploadMedia):', { url: fullUrl, error });
    throw error;
  }
}

export async function getCategoryById(id: number): Promise<Category> {
  const token = await getToken()
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    throw new Error("Thiếu biến môi trường API_BASE_URL")
  }
  const fullUrl = `${baseUrl.replace(/\/+$/, "")}/categories/${id}`
  try {
    const data = await fetchWithTimeout<Category>(fullUrl, token)
    return data
  } catch (error) {
    console.error("Lỗi gọi API (getCategoryById):", { url: fullUrl, error })
    throw error
  }
}

export async function createCategory(request: CreateCategoryRequest): Promise<Category> {
  const token = await getToken()
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    throw new Error("Thiếu biến môi trường API_BASE_URL")
  }
  const fullUrl = `${baseUrl.replace(/\/+$/, "")}/categories`
  try {
    const data = await fetchWithTimeout<Category>(fullUrl, token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
    return data
  } catch (error) {
    console.error("Lỗi gọi API (createCategory):", { url: fullUrl, error })
    throw error
  }
}

export async function updateCategory(id: number, request: CreateCategoryRequest): Promise<Category> {
  const token = await getToken()
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    throw new Error("Thiếu biến môi trường API_BASE_URL")
  }
  const fullUrl = `${baseUrl.replace(/\/+$/, "")}/categories/${id}`
  try {
    const data = await fetchWithTimeout<Category>(fullUrl, token, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
    return data
  } catch (error) {
    console.error("Lỗi gọi API (updateCategory):", { url: fullUrl, error })
    throw error
  }
}