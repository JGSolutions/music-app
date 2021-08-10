import { IArtistBodyRequest, IPlatformTypes } from "models/artist.types";

export class ArtistSongsAction {
  static readonly type = '[Songs] List of artist songs';
  constructor(public uid: string | undefined, public artistPlatform: IArtistBodyRequest[]) { }
}

export class ArtistAlbumSongs {
  static readonly type = '[Songs] Albums songs';
  constructor(public uid: string | undefined, public platform: IPlatformTypes, public id: string) { }
}

export class SaveCurrentSelectedSongAction {
  static readonly type = '[Songs] Save Selected Current Track';
  constructor(public uid: string) { }
}

export class SetCurrentSelectedSongAction {
  static readonly type = '[Songs] Set State Selected Current Track';
  constructor(public id: string) { }
}

export class GetCurrentSelectedTrackAction {
  static readonly type = '[Songs] Get selected Current Track';
  constructor(public uid: string) { }
}

export class AudioFileAction {
  static readonly type = '[Songs] Audio Stream File';
  constructor(public uid: string | undefined, public externalUrl: string | undefined) { }
}

export class ClearSongs {
  static readonly type = '[Songs] Clear Song State';
}

export class SetCurrentTrackPlayStatusAction {
  static readonly type = '[Songs] Set the current playing status';
  constructor(public isPlaying: boolean) { }
}

export class AllPlaylistTracksAction {
  static readonly type = '[Songs] All Playlist Songs Data';
  constructor(public playlistid: string, public uid: string) { }
}
