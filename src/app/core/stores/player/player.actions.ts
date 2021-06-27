export class CurrentPlayerAction {
  static readonly type = '[Player] Current Player Bar';
  constructor(public uid: string) { }
}

export class MixcloudAudioAction {
  static readonly type = '[Player] Mixcloud Audio';
  constructor(public uid: string | undefined, public externalUrl: string | undefined) { }
}

export class LoadingPlayerAction {
  static readonly type = '[Player] Loading Player';
  constructor(public loadingValue: boolean) { }
}
