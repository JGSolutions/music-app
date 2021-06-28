export class AddHistoryAction {
  static readonly type = '[History] Add To History';
  constructor(public uid: string, public track: any) { }
}
