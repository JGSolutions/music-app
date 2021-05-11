import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { OpenPlayerAction } from './player.actions';
import { IPlayerState, playerStateDefault } from './player.types';

@State<IPlayerState>({
  name: 'player',
  defaults: playerStateDefault,
})
@Injectable()
export class PlayerState {
  @Selector()
  static currentTrack(state: IPlayerState) {
    return state.currentTrack;
  }

  @Action(OpenPlayerAction)
  _openPlayerBar(ctx: StateContext<IPlayerState>, { currentTrack }: OpenPlayerAction) {
    ctx.patchState({
      currentTrack: currentTrack
    });
    // return this.connectedServices.connectedServices(uid).pipe(
    //   tap((data) => {
    //     ctx.patchState({
    //       servicesType: data
    //     });
    //   })
    // )
  }

}
