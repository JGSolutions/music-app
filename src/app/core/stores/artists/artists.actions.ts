import { IArtists, IPlatformTypes } from "models/artist.types";

export class ArtistsAction {
  static readonly type = '[Artists] List of artists';
  constructor(public uid: string | undefined) { }
}


export class SelectArtistAction {
  static readonly type = '[Artists] Selected artist';
  constructor(public artist: IArtists[]) { }
}

export class FilterArtistsByPlatformAction {
  static readonly type = '[Artists] Filter by platform';
  constructor(public platform: IPlatformTypes) { }
}
