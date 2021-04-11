import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MusicConnectedService } from 'src/app/services/music-connected.services';
import { ConnectedServicesAction } from './connected-services.actions';
import { ConnectedServicesModel } from './connected-services.types';

@State<ConnectedServicesModel>({
  name: 'connectedServices',
  defaults: {
    services: {},
    loaded: false,
  },
})
@Injectable()
export class ConnectedServicesState {
  constructor(private connectedServices: MusicConnectedService) {
  }

  @Selector()
  static services(state: ConnectedServicesModel) {
    return state.services;
  }

  @Action(ConnectedServicesAction)
  setUser(ctx: StateContext<ConnectedServicesModel>, { uid }: ConnectedServicesAction) {
    return this.connectedServices.connectedServices(uid).pipe(
      tap((services) => {
        ctx.patchState({
          services,
        });
      })
    )

  }
}
