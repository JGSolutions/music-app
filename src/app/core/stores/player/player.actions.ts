export class CurrentPlayerAction {
  static readonly type = '[Player] Current Player Bar';
  constructor(public uid: string) { }
}

export class LoadingPlayerAction {
  static readonly type = '[Player] Loading Player';
  constructor(public loadingValue: boolean) { }
}
