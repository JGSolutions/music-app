import { String } from "lodash";

export interface ConnectedServicesModel {
  services: Record<string, ConnectedToken>;
  loaded: boolean;
}

export interface ConnectedToken {
  token: string;
}

export enum IConnectedServicesTypes {
  mixcloud = "mixcloud",
  spotify = "spotify",
}
