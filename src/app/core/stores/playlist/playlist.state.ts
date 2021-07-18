import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PlaylistService } from 'src/app/services/playlist.service';
import { CreatePlaylistAction, PlaylistDataAction } from './playlist.actions';
import { IPlayerlistState, playerlistStateDefault } from './playlist.types';

@State<IPlayerlistState>({
  name: 'playlist',
  defaults: playerlistStateDefault,
})
@Injectable()
export class PlaylistState {
  constructor(private playlistService: PlaylistService) { }

  @Selector()
  static loadingPlaylist(state: IPlayerlistState) {
    return state.loadingPlaylist;
  }

  @Action(CreatePlaylistAction)
  _createPlaylist(ctx: StateContext<IPlayerlistState>, { data }: CreatePlaylistAction) {
    this.playlistService.create(data);
  }

  @Action(PlaylistDataAction)
  _playlistData(ctx: StateContext<IPlayerlistState>, { uid }: PlaylistDataAction) {
    // this.playlistService.create(data);
    // ctx.patchState({
    //   loadingPlayer: loadingValue
    // });
  }

}
