import { Media, Root } from "../definitions";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  image: Media;
  createdDate: string;
  lastModifiedDate: string;
  parentId?: number;
  children: Category[];
}

export type CategoryResponse = Root<Category>;

export type UpdateCategoryRequest = {
  name: string
  slug: string
  description: string
  parentId?: number
  active: boolean
  imageId?: number
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description: string
  imageId?: number
  active: boolean
  parentId?: number
}