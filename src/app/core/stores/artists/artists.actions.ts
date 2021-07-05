import { IArtistBodyRequest, IPlatformTypes } from "models/artist.types";

export class ArtistsAction {
  static readonly type = '[Artists] List of artists';
  constructor(public uid: string | undefined) { }
}
export class ArtistSongsAction {
  static readonly type = '[Artists] List of artist songs';
  constructor(public uid: string | undefined, public artistPlatform: IArtistBodyRequest[]) { }
}

export class ArtistAlbumSongs {
  static readonly type = '[Artists] Albums songs';
  constructor(public uid: string | undefined, public platform: IPlatformTypes, public id: string) { }
}

export class SaveCurrentSelectedSongAction {
  static readonly type = '[Artists] Save Selected Current Track';
  constructor(public uid: string) { }
}

export class SetCurrentSelectedSongAction {
  static readonly type = '[Artists] Set State Selected Current Track';
  constructor(public id: string) { }
}

export class GetCurrentSelectedTrackAction {
  static readonly type = '[Artists] Get selected Current Track';
  constructor(public uid: string) { }
}

export class AudioFileAction {
  static readonly type = '[Artists] Audio Stream File';
  constructor(public uid: string | undefined, public externalUrl: string | undefined) { }
}

export class ArtistClearSongs {
  static readonly type = '[Artists] Clear Song State';
}

export class SetCurrentTrackPlayStatusAction {
  static readonly type = '[Artists] Set the current playing status';
  constructor(public isPlaying: boolean) { }
}
