export interface IConnectedServicesState {
  servicesType: ConnectedServices;
  loading: boolean;
}

export const connectedServicesStateDefault: IConnectedServicesState = {
  servicesType: {},
  loading: false
};

export type ConnectedServices = Record<string, ConnectedToken>;
export interface ConnectedToken {
  token: string;
}
export interface ConnectedServicesList {
  token: string;
  type: IConnectedServicesTypes;
}

export enum IConnectedServicesTypes {
  mixcloud = "mixcloud",
  spotify = "spotify",
  deezer = "deezer",
  all = "all"
}
