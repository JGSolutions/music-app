import { IArtists, IPlatformTypes } from "models/artist.types";
import { IAlbumInfo, IDurationType, ISong, ISongTrackType } from "models/song.types";

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
  loading: true,
};

export interface ICurrentTrack {
  platform: IPlatformTypes;
  isPlaying?: boolean;
  id: string;
  albumid?: string;
  name: string;
  trackType: ISongTrackType,
  artist?: string;
  externalUrl?: string;
  avatar?: string;
  audioFile?: string;
  duration?: number;
  durationType?: IDurationType;
}
