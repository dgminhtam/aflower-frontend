"use server"

import { fetchAuthenticated } from '../auth/action';
import { Media } from '../definitions';

export async function uploadMedia(fileData: FormData): Promise<Media> {
  const fullUrl = "/medias/upload";
  return await fetchAuthenticated<Media>(
    fullUrl, 
    { 
      method: 'POST',
      body: fileData
    }
  );
}