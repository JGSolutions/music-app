import { IAvatar } from "./avatar.types";

export enum IPlatformTypes {
  mixcloud = "mixcloud",
  spotify = "spotify",
  deezer = "deezer",
  soundcloud = "soundcloud",
  youtube = "youtube",
  all = "all"
}

export interface IArtistBodyRequest {
  type: string;
  username: string;
  id: string;
}

export interface IArtists {
  name: string;
  id: string;
  uri?: string;
  genres?: string[];
  platform: IPlatformTypes;
  username: string;
  pictures: IAvatar;
}
