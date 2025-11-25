"use server"

import { Media, MediaResponse } from '@/app/lib/media/definitions';
import { queryParamsToString } from '@/app/lib/utils';
import { SearchParams } from '../../lib/definitions';
import { fetchAuthenticated } from '../auth/action';
import { revalidatePath } from 'next/cache';

export const uploadMedia = async (fileData: FormData): Promise<Media> =>
  fetchAuthenticated<Media>("/medias/upload",
    {
      method: 'POST',
      body: fileData
    }
  );

export const getMedias = async (searchParams: SearchParams) =>
  fetchAuthenticated<MediaResponse>(`/medias?${queryParamsToString(searchParams)}`);

export const getMedia = async (id: number) =>
  fetchAuthenticated<Media>(`/medias/${id}`);

export const deleteMedia = async (id: number) => {
  await fetchAuthenticated<void>(`/medias/${id}`, {
    method: 'DELETE'
  });
  revalidatePath('/medias');
}

export const deleteMedias = async (ids: number[]) => {
  await Promise.all(ids.map(id => fetchAuthenticated<void>(`/medias/${id}`, {
    method: 'DELETE'
  })));
  revalidatePath('/medias');
}