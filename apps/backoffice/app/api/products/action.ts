import { fetchAuthenticated } from '@/app/lib/auth/action';
import { Product, ProductResponse } from '@/app/lib/products/definitions';
import { buildFilterQuery, buildSortQuery } from '@/app/lib/utils';
import { URLSearchParams } from 'url';

export async function getProducts(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<ProductResponse> {

  const {
    page: humanPage = '1',
    size = '12',
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

  const fullUrl = `/products?${query.toString()}`;

  try {
    const data = await fetchAuthenticated<ProductResponse>(fullUrl);
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

export async function getProductById(id: number): Promise<Product> {
  const fullUrl = `/products/${id}`;
  return await fetchAuthenticated<Product>(fullUrl);
}