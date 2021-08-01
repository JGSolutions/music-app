import { IArtists } from "./artist.types";
import { ISong } from "./song.types";

export interface ISearchResults {
  artists: IArtists[];
  tracks: ISong[];
}
