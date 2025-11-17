import { Root } from "../definitions";
import { Media } from "../media/definitions";

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