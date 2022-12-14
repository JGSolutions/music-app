import { IArtistBodyRequest, IPlatformTypes } from "models/artist.types";
import { ICurrentTrack } from "./songs.types";

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
  constructor(public id: string, public type: string) { }
}

export class GetCurrentSelectedTrackAction {
  static readonly type = '[Songs] Get selected Current Track';
  constructor(public uid: string) { }
}

export class CloseCurrentTrackAction {
  static readonly type = '[Songs] Close selected Current Track';
  constructor(public uid: string) { }
}

export class AudioFileAction {
  static readonly type = '[Songs] Audio Stream File';
  constructor(public uid: string | undefined, public externalUrl: string | undefined) { }
}

export class SoundcloudAudioFileAction {
  static readonly type = '[Songs] Soundcloud Audio Stream File';
  constructor(public uid: string | undefined, public externalUrl: string | undefined) { }
}

export class ClearSongs {
  static readonly type = '[Songs] Clear Song State';
}

export class SetCurrentTrackPlayStatusAction {
  static readonly type = '[Songs] Set the current playing status';
  constructor(public isPlaying: boolean) { }
}

export class LoadingPlayerAction {
  static readonly type = '[Songs] Loading player';
  constructor(public loading: boolean) { }
}

export class SetCurrentSongAction {
  static readonly type = '[Songs] Set current track';
  constructor(public currentTrack: ICurrentTrack) { }
}

export class FilterSongsByPlatformAction {
  static readonly type = '[Songs] Filter songs by platform';
  constructor(public platform: IPlatformTypes) { }
}
