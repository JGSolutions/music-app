export class ConnectServiceAction {
  static readonly type = '[ConnectServices] Connect Service';
}

export class ConnectedServicesAction {
  static readonly type = '[ConnectServices] All Connected Services';

  constructor(public uid: string) {}
}
