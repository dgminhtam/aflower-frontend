import { Root } from "../definitions";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  media: Media;
  createdDate: string;
  lastModifiedDate: string;
  parentId?: number;
  children: Category[];
}

export type CategoryResponse = Root<Category>;


export interface UpdateCategoryRequest {
  name: string;
  description: string;
}

export interface Media {
  id: number;
  altText: string;
  urlOriginal: string;
  urlLarge: string;
  urlMedium: string;
  urlThumbnail: string;
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description: string
  imageId?: number
  active: boolean
  parentId?: string
}