import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MusicConnectedService } from 'src/app/services/music-connected.services';
import { OpenPlayerAction } from './player.actions';
import { IPlayerState, playerStateDefault } from './player.types';

@State<IPlayerState>({
  name: 'player',
  defaults: playerStateDefault,
})
@Injectable()
export class PlayerState {
  constructor(private connectedServices: MusicConnectedService) {
  }

  // @Selector()
  // static loading(state: IPlayerState) {
  //   return state.loading;
  // }

  @Action(OpenPlayerAction)
  _connectedServices(ctx: StateContext<IPlayerState>, { uid }: OpenPlayerAction) {
    // return this.connectedServices.connectedServices(uid).pipe(
    //   tap((data) => {
    //     ctx.patchState({
    //       servicesType: data
    //     });
    //   })
    // )
  }

}
