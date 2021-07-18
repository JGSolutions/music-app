import { IPlaylist } from "./playlist.types";

export class CreatePlaylistAction {
  static readonly type = '[Playerlist] Create Playlist';
  constructor(public data: IPlaylist) { }
}

export class PlaylistDataAction {
  static readonly type = '[Playerlist] Playlist Data';
  constructor(public uid: string) { }
}
