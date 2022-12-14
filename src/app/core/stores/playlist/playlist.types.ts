import { IArtistName, IPlatformTypes } from "models/artist.types";
import { IAvatar } from "models/avatar.types";
import { IPlayListDetails, IPlayLists, IPlaylistTracks } from "../../../../../models/playlist.types";
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
  platform: IPlatformTypes;
  uid: string;
  playlistid: string;
  loadingPlaylist: boolean;
  playlistData: IPlayLists[];
  playlistDetail: IPlayListDetails;
  playlistTracks: IPlaylistTracks[];
  playListSelected: string[];
  // playlistTrack: ISelectedPlaylist;
  // allPlaylistTracks: ISelectedPlaylist[];
}

export const playerlistStateDefault: IPlayerlistState = {
  platform: IPlatformTypes.spotify,
  uid: "",
  playlistid: "",
  loadingPlaylist: false,
  playlistData: [],
  playlistDetail: {} as IPlayListDetails,
  playlistTracks: [],
  playListSelected: [],
  // playlistTrack: {} as ISelectedPlaylist,
  // allPlaylistTracks: []
};
