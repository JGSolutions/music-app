import { IArtists, IPlatformTypes } from "models/artist.types";
export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  loading: boolean;
  platform: IPlatformTypes,
  selectedArtist: IArtists[]
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  loading: false,
  platform: IPlatformTypes.all,
  selectedArtist: []
};
