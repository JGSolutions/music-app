import { IArtists } from "functions/src/models/IArtists.types";
import { Pictures } from "functions/src/models/IPictures.types";
import { IPlatformTypes } from "models/artist.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  artistSongs: IArtistSongs[]
  loading: boolean;
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  artistSongs: [],
  loading: false
};

export interface IArtistSongs {
  artistName: string;
  createdTime: string;
  id: string;
  length: number;
  name: string;
  platform: IPlatformTypes;
  totalTracks: number;
  trackType: ITrackType;
  pictures: Pictures;
  externalUrl?: string;
}
