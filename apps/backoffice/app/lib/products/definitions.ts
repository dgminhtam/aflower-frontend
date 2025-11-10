import { Category } from "../categories/definitions";
import { Root } from "../definitions";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  maxOrderQuantity: number;
  minOrderQuantity: number;
  category: Category;
  image: Image
  originPrice: number;
  status: string;
  externalId: string;
}

export interface ProductDetail extends Product {
  variants: ProductDetail[]
}

export interface Image {
  fileName: string;
  altText: string;
  description: string;
  realFileName: string;
  mimeType: string;
  fileSizeInByte: number;
  url: string;
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
  { value: 'ARCHIVE', label: 'Lưu trữ', classStyle: 'bg-gray-500 hover:bg-gray-600 text-white' },
  { value: 'APPROVED', label: 'Duyệt', classStyle: 'bg-green-500 hover:bg-green-600 text-white' },
];

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: number;
}