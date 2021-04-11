import { IConnectedServicesTypes } from "./connected-services.types";

export class ConnectServiceAction {
  static readonly type = '[ConnectServices] Connect Service';
}

export class ConnectedServicesAction {
  static readonly type = '[ConnectServices] All Connected Services';

  constructor(public uid: string) {}
}

export class DisconnectServiceAction {
  static readonly type = '[ConnectServices] Disonnected Service';

  constructor(public uid: string | undefined, public type: IConnectedServicesTypes) {}
}
