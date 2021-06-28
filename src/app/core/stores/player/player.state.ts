import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LoadingPlayerAction } from './player.actions';
import { IPlayerState, playerStateDefault } from './player.types';

@State<IPlayerState>({
  name: 'player',
  defaults: playerStateDefault,
})
@Injectable()
export class PlayerState {
  constructor() { }

  @Selector()
  static loadingPlayer(state: IPlayerState) {
    return state.loadingPlayer;
  }

  @Action(LoadingPlayerAction)
  _loadingPlayer(ctx: StateContext<IPlayerState>, { loadingValue }: LoadingPlayerAction) {
    ctx.patchState({
      loadingPlayer: loadingValue
    });

    return;
  }

}
