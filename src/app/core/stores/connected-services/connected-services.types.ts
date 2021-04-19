export interface IConnectedServicesState {
  servicesList: ConnectedServicesList[];
  servicesType: ConnectedServices;
  loading: boolean;
}

export const connectedServicesStateDefault: IConnectedServicesState = {
  servicesList: [],
  servicesType: {},
  loading: false
};

export type ConnectedServices = Record<string, ConnectedToken>;
export interface ConnectedToken {
  token: string;
}
export interface ConnectedServicesList {
  token: string;
  type: string;
}

export enum IConnectedServicesTypes {
  mixcloud = "mixcloud",
  spotify = "spotify",
}
