import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { LoadingPlayerAction, MixcloudAudioAction, OpenPlayerAction } from './player.actions';
import { IPlayerState, playerStateDefault } from './player.types';

@State<IPlayerState>({
  name: 'player',
  defaults: playerStateDefault,
})
@Injectable()
export class PlayerState {
  constructor(private _apiService: ApiService) { }

  @Selector()
  static currentTrack(state: IPlayerState) {
    return state.currentTrack;
  }

  @Selector()
  static mixcloudAudio(state: IPlayerState) {
    return state.mixcloudAudio;
  }

  @Selector()
  static loadingPlayer(state: IPlayerState) {
    return state.loadingPlayer;
  }

  @Action(OpenPlayerAction)
  _openPlayerBar(ctx: StateContext<IPlayerState>, { currentTrack }: OpenPlayerAction) {
    return ctx.patchState({
      currentTrack
    });
  }

  @Action(MixcloudAudioAction)
  _mixcloudAudio(ctx: StateContext<IPlayerState>, { uid, externalUrl }: MixcloudAudioAction) {
    return this._apiService.mixcloudAudioStream(uid!, externalUrl!).pipe(
      tap((url) => {
        ctx.patchState({
          mixcloudAudio: url
        });
      })
    )
  }

  @Action(LoadingPlayerAction)
  _loadingPlayer(ctx: StateContext<IPlayerState>, { loadingValue }: LoadingPlayerAction) {
    ctx.patchState({
      loadingPlayer: loadingValue
    });

    return;
  }

}
