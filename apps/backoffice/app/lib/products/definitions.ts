import { Category } from "../categories/definitions";
import { Media, Root } from "../definitions";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  originPrice: number;
  category: Category;
  image: Media;
  status: string;
}

export type ProductResponse = Root<Product>;

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface ChangeStatusRequest {
  status: string;
}

export const productStatuses = [
  { value: 'DRAFT', label: 'Nháp', classStyle: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
  { value: 'APPROVED', label: 'Duyệt', classStyle: 'bg-green-500 hover:bg-green-600 text-white' },
];

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: number;
}