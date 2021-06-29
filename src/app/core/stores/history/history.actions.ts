import { IHistoryTracks } from "./history.types";

export class AddHistoryAction {
  static readonly type = '[History] Add To History';
  constructor(public uid: string, public track: IHistoryTracks) { }
}

export class HistoryListAction {
  static readonly type = '[History] History List';
  constructor(public uid: string) { }
}
