import { IPlatformTypes } from "models/artist.types";
import { IPlayLists } from "models/playlist.types";
import { ISelectedPlaylist } from "./playlist.types";

export class CreatePlaylistAction {
  static readonly type = '[Playlist] Create Playlist';
  constructor(public data: IPlayLists) { }
}

export class AddToPlaylistAction {
  static readonly type = '[Playlist] Add To Playlist';
  constructor(public selectedSong: ISelectedPlaylist, public selectedPlaylist: string, public uid: string) { }
}

export class RemoveToPlaylistAction {
  static readonly type = '[Playlist] Remove From Playlist';
  constructor(public selectedPlaylist: string, public uid: string) { }
}

export class PlaylistDataAction {
  static readonly type = '[Playlist] Playlist Data';
  constructor(public uid: string) { }
}

export class PlaylistTrackDataAction {
  static readonly type = '[Playlist] Playlist Track Data';
  constructor(public uid: string, public songid: string) { }
}
export class PlaylistDetailAction {
  static readonly type = '[Playlist] Playlist details';
  constructor(public uid: string, public playlistid: string, public platform: IPlatformTypes) { }
}

