export class ArtistsAction {
  static readonly type = '[Artists] List of artists';
  constructor(public uid: string | undefined) { }
}

export class ArtistSongsAction {
  static readonly type = '[Artists] List of artist songs';
  constructor(public uid: string | undefined, public artistPlatform: any[]) { }
}

