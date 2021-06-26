import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MusicConnectedService } from 'src/app/services/music-connected.service';
import { ConnectedServicesAction, DisconnectServiceAction } from './connected-services.actions';
import { connectedServicesStateDefault, IConnectedServicesState } from './connected-services.types';

@State<IConnectedServicesState>({
  name: 'connectedServices',
  defaults: connectedServicesStateDefault,
})
@Injectable()
export class ConnectedServicesState {
  constructor(private connectedServices: MusicConnectedService) {
  }

  @Selector()
  static servicesList(state: IConnectedServicesState) {
    const data = state.servicesType;
    return Object.keys(data).map((key) => {
      return {
        type: key,
        token: data[key].token
      };
    });
  }

  @Selector()
  static servicesType(state: IConnectedServicesState) {
    return state.servicesType;
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
          servicesType: data
        });
      })
    )
  }

  @Action(DisconnectServiceAction)
  _disconnectServices(ctx: StateContext<IConnectedServicesState>, { uid, type }: DisconnectServiceAction) {
    return this.connectedServices.disconnectService(uid, type);
  }
}
