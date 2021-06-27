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

export class CurrentSelectedSongAction {
  static readonly type = '[Artists] Selected Current Track';
  constructor(public uid: string, public id: string) { }
}

