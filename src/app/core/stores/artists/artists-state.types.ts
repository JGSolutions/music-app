import { IArtists } from "models/artist.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  loading: boolean;
  selectedArtist: IArtists[]
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  loading: true,
  selectedArtist: []
};
