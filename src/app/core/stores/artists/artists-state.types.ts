import { IArtists } from "models/artist.types";
import { IAlbumInfo, ISong } from "models/song.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  artistSongs: ISong[],
  artistAlbum: IAlbumInfo;
  loading: boolean;
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  artistSongs: [],
  artistAlbum: {} as IAlbumInfo,
  loading: false,
};
