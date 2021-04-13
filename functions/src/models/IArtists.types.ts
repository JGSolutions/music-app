import {IPlatformTypes} from "../../sdk/IPlatforms.types";
import {Pictures} from "./IPictures.types";

export interface IArtists {
  name: string;
  id: string;
  platform: IPlatformTypes;
  username: string;
  pictures: Pictures;
}
