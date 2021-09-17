import { IArtistName, IArtists, IPlatformTypes } from "models/artist.types";
import { IAvatar } from "models/avatar.types";
import { IAlbumInfo, IDurationType, ISong, ISongTrackType } from "models/song.types";
import { ISelectedPlaylist } from "../playlist/playlist.types";

export type ISongCommonState = ISong | ISelectedPlaylist;

export interface ISoundcloudStreamUrls {
  hls_mp3_128_url: string;
  hls_opus_64_url: string;
  http_mp3_128_url: string;
  preview_mp3_128_url: string;
}

export interface ISongsState {
  songs: ISongCommonState[],
  artist: IArtists,
  playlistSongs: ISongCommonState[],
  artistAlbum: IAlbumInfo;
  currentTrack: ICurrentTrack;
  loading: boolean;
  songsLoading: boolean;
  currentTrackLoading: boolean,
  soundcloudStreamUrls: ISoundcloudStreamUrls
}

export const songsStateDefault: ISongsState = {
  songs: [],
  artist: {} as IArtists,
  playlistSongs: [],
  artistAlbum: {} as IAlbumInfo,
  currentTrack: {} as ICurrentTrack,
  loading: false,
  currentTrackLoading: false,
  songsLoading: false,
  soundcloudStreamUrls: {} as ISoundcloudStreamUrls
};

export interface ICurrentTrack {
  platform: IPlatformTypes;
  isPlaying?: boolean;
  id: string;
  albumid?: string;
  name: string;
  trackType: ISongTrackType,
  artist?: IArtistName[];
  externalUrl?: string;
  avatar?: IAvatar;
  audioFile?: string;
  duration?: number;
  createdTime?: string;
  durationType?: IDurationType;
}
