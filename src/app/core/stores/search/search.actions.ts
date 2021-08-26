export class SearchAction {
  static readonly type = '[Search] Search';
  constructor(public value: string, public uid: string) { }
}

export class SearchTypeAction {
  static readonly type = '[Search] Search Type';
  constructor(public selected: number) { }
}
