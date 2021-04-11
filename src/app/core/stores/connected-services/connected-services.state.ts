import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MusicConnectedService } from 'src/app/services/music-connected.services';
import { ConnectedServicesAction, DisconnectServiceAction } from './connected-services.actions';
import { connectedServicesStateDefault, IConnectedServicesState, IConnectedServicesTypes } from './connected-services.types';

@State<IConnectedServicesState>({
  name: 'connectedServices',
  defaults: connectedServicesStateDefault,
})
@Injectable()
export class ConnectedServicesState {
  constructor(private connectedServices: MusicConnectedService) {
  }

  @Selector()
  static services(state: IConnectedServicesState) {
    return state.services;
  }

  @Selector()
  static loading(state: IConnectedServicesState) {
    return state.loading;
  }

  @Action(ConnectedServicesAction)
  _connectedServices(ctx: StateContext<IConnectedServicesState>, { uid }: ConnectedServicesAction) {
    return this.connectedServices.connectedServices(uid).pipe(
      tap((data) => {
        ctx.patchState({
          services: data,
        });
      })
    )
  }

  @Action(DisconnectServiceAction)
  _disconnectServices(ctx: StateContext<IConnectedServicesState>, { uid, type }: DisconnectServiceAction) {
    return this.connectedServices.disonnectService(uid, type);
  }
}
