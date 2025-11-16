import { Category } from "../categories/definitions";
import { Root } from "../definitions";
import { Media } from "../media/definitions";

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
  gallery: Media[];
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