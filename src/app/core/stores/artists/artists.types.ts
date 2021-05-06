import { IArtists } from "functions/src/models/IArtists.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  loading: boolean;
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  loading: false
};
