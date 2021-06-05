import { IArtists } from "models/artist.types";
import { ISong } from "models/song.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  artistSongs: ISong[]
  loading: boolean;
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  artistSongs: [],
  loading: false
};
