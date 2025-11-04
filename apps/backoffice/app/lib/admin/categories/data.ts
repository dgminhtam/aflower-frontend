import { auth } from '@clerk/nextjs/server';
import { URLSearchParams } from "url";
import { CategoryResponse } from '@/app/lib/admin/categories/definitions';
import { buildFilterQuery, buildSortQuery } from '@/app/lib/admin/utils';

export async function getCategories(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<CategoryResponse> {
  
  const { getToken, userId } = await auth(); 
  if (!userId) {
    throw new Error('Chưa xác thực'); 
  }
  const token = await getToken({ template: 'aflower' });
  if (!token) {
    throw new Error('Không lấy được token');
  }

  const baseUrl = process.env.API_BASE_URL;
  
  const { page: humanPage = '1', size = '10', sort = '', ...searchFields } = searchParams;
  
  const pageNumber = Number(humanPage);
  const javaPageIndex = pageNumber > 0 ? pageNumber - 1 : 0;

  const query = new URLSearchParams();
  query.append('page', String(javaPageIndex));
  query.append('size', String(size));
  
  const sortArray = buildSortQuery(sort);
  if (sortArray.length > 0) {
    sortArray.forEach(s => query.append('sort', `${s.field}_${s.direction}`));
  }

  const filterQuery = buildFilterQuery(searchFields);
  if (filterQuery) {
    query.append('$filter', filterQuery);
  }
  
  const fullJavaUrl = `${baseUrl}/categories?${query.toString()}`;

  try {
    const javaResponse = await fetch(fullJavaUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store', 
    });

    if (!javaResponse.ok) {
      throw new Error(`API từ chối request: ${javaResponse.status}`);
    }

    const data: CategoryResponse = await javaResponse.json();
    return data;

  } catch (error) {
    console.error('Lỗi gọi API (getCategories):', error);
    return {
      content: [],
      pageable: { pageNumber: 0, pageSize: Number(size), offset: 0, paged: true, unpaged: false },
      last: true,
      totalElements: 0,
      totalPages: 0,
      size: Number(size),
      number: 0,
      first: true,
      numberOfElements: 0,
      empty: true
    };
  }
}