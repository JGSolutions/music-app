import { IArtistName, IPlatformTypes } from "models/artist.types";
import { IAvatar } from "models/avatar.types";
import { IPlayListDetails, IPlayLists } from "../../../../../models/playlist.types";
import { IDurationType, ISongTrackType } from "models/song.types";

export interface ISelectedPlaylist {
  id?: string;
  playlists: string[];
  name: string;
  duration?: number;
  albumid?: string;
  artist?: IArtistName[];
  albumName?: string;
  durationType?: IDurationType;
  platform: IPlatformTypes
  trackType: ISongTrackType;
  pictures: IAvatar;
  externalUrl?: string;
  createdTime?: string;
  totalTracks?: number;
  streamUrl?: string;
}

export interface IPlayerlistState {
  loadingPlaylist: boolean;
  playlistData: IPlayLists[];
  playlistDetail: IPlayListDetails;
  playListSelected: string[];
  // playlistTrack: ISelectedPlaylist;
  // allPlaylistTracks: ISelectedPlaylist[];
}

export const playerlistStateDefault: IPlayerlistState = {
  loadingPlaylist: false,
  playlistData: [],
  playlistDetail: {} as IPlayListDetails,
  playListSelected: [],
  // playlistTrack: {} as ISelectedPlaylist,
  // allPlaylistTracks: []
};
