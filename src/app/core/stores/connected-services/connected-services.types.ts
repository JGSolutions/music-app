export interface IConnectedServicesState {
  services: ConnectedServices;
  loading: boolean;
}

export const connectedServicesStateDefault: IConnectedServicesState = {
  services: {},
  loading: false
};

export type ConnectedServices = Record<string, ConnectedToken>;
export interface ConnectedToken {
  token: string;
}

export enum IConnectedServicesTypes {
  mixcloud = "mixcloud",
  spotify = "spotify",
}
