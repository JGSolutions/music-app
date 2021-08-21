export class SearchAction {
  static readonly type = '[Search] Search';
  constructor(public value: string, public uid: string) { }
}
