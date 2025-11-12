export interface SearchParams {
  filter: string;
  page: number;
  size: number;
  sort: Sort[];
}

export interface Sort {
  field: string;
  direction: "asc" | "desc";
}

export interface Root<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface Option {
  value: string;
  label: string;
}


export interface URLSearchParams {
  search: FieldSearch[];
  page: number;
  size: number;
  sort: string[];
}

export interface FieldSearch {
  name:string;
  value: string[] | string;
}

export interface Media {
  id: number;
  altText: string;
  urlOriginal: string;
  urlLarge: string;
  urlMedium: string;
  urlThumbnail: string;
}