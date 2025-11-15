import { Media, MediaResponse } from '@/app/lib/media/definitions';
import { queryParamsToString } from '@/app/lib/utils';
import { SearchParams } from '../../lib/definitions';
import { fetchAuthenticated } from '../auth/action';

export const uploadMedia = (fileData: FormData): Promise<Media> =>
  fetchAuthenticated<Media>("/medias/upload",
    {
      method: 'POST',
      body: fileData
    }
  );

export const getMedias = (searchParams: SearchParams) =>
  fetchAuthenticated<MediaResponse>(`/medias?${queryParamsToString(searchParams)}`);