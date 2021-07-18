import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
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

  @Selector()
  static playlist(state: IPlayerlistState) {
    return state.playlistData;
  }

  @Action(CreatePlaylistAction)
  _createPlaylist(ctx: StateContext<IPlayerlistState>, { data }: CreatePlaylistAction) {
    this.playlistService.create(data);
  }

  @Action(PlaylistDataAction)
  _playlistData(ctx: StateContext<IPlayerlistState>, { uid }: PlaylistDataAction) {
    ctx.patchState({
      loadingPlaylist: true
    });
    return this.playlistService.getPlaylists(uid).pipe(
      tap(data => {
        ctx.patchState({
          playlistData: data,
          loadingPlaylist: false
        });
      })
    );
  }

}
