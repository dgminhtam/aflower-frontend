import { Root } from "../definitions";

export interface Media {
  id: number;
  name: string;
  altText: string;
  urlOriginal: string;
  urlLarge: string;
  urlMedium: string;
  urlThumbnail: string;
  size: number;
}

export type MediaResponse = Root<Media>;