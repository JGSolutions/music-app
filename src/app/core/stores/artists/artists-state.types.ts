import { IArtists, IPlatformTypes } from "models/artist.types";
import { IAlbumInfo, ISong, ISongTrackType } from "models/song.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  artistSongs: ISong[],
  artistAlbum: IAlbumInfo;
  loading: boolean;
  currentTrack: ICurrentTrack;
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  artistSongs: [],
  artistAlbum: {} as IAlbumInfo,
  currentTrack: {} as ICurrentTrack,
  loading: false,
};

export interface ICurrentTrack {
  platform?: IPlatformTypes;
  name: string;
  trackType: ISongTrackType,
  artist?: string;
  externalUrl?: string;
  avatar?: string;
  audioFile?: string;
}
