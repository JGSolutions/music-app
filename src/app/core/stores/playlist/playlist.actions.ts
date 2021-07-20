import { IPlaylist } from "./playlist.types";

export class CreatePlaylistAction {
  static readonly type = '[Playerlist] Create Playlist';
  constructor(public data: IPlaylist) { }
}

export class AddToPlaylistAction {
  static readonly type = '[Playerlist] Add To Playlist';
  constructor(public selectedSong: any, public selectedPlaylist: string, public uid: string) { }
}

export class RemoveToPlaylistAction {
  static readonly type = '[Playerlist] Remove From Playlist';
  constructor(public selectedSong: any, public selectedPlaylist: string, public uid: string) { }
}

export class PlaylistDataAction {
  static readonly type = '[Playerlist] Playlist Data';
  constructor(public uid: string) { }
}

export class PlaylistTrackDataAction {
  static readonly type = '[Playerlist] Playlist Track Data';
  constructor(public uid: string, public songid: string) { }
}
