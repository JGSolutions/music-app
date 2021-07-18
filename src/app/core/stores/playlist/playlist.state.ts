import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddPlaylistAction } from './playlist.actions';
import { IPlayerlistState, playerlistStateDefault } from './playlist.types';

@State<IPlayerlistState>({
  name: 'playlist',
  defaults: playerlistStateDefault,
})
@Injectable()
export class PlayerState {
  constructor() { }

  @Selector()
  static loadingPlaylist(state: IPlayerlistState) {
    return state.loadingPlaylist;
  }

  @Action(AddPlaylistAction)
  _addPlaylist({ patchState }: StateContext<IPlayerlistState>, { uid }: AddPlaylistAction) {
    // ctx.patchState({
    //   loadingPlayer: loadingValue
    // });
  }

}
