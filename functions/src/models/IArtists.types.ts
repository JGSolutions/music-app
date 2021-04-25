import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { Pictures } from "./IPictures.types";

export interface IArtists {
  name: string;
  id: string;
  platform: IPlatformTypes;
  username: string;
  pictures: Pictures;
}
export interface IArtistSongs {
  name: string;
  tags: string[];
  platform: IPlatformTypes;
  createdTime: string;
  id: string;
  length: number;
  username: string;
  artistName: string;
  pictures: Pictures;
}

export interface ArtistBodyRequest {
  type: string;
  id: string;
}
