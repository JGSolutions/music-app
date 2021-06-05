import { IPlatformTypes } from "models/artist.types";

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
  type: IPlatformTypes;
}
