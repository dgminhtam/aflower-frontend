import { Root } from "../../definitions";

export interface Category {
  id: number;
  name: string;
  description: string;
  createdDate: string;
  lastModifiedDate: string;
}

export type CategoryResponse = Root<Category>;


export interface UpdateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface AssignVariantsRequest {
  variantIds: number[];
}