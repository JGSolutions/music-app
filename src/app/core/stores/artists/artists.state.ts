import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ArtistsAction, ArtistSongsAction } from './artists.actions';
import { artistsStateDefault, IArtistsState } from './artists.types';

@State<IArtistsState>({
  name: 'artists',
  defaults: artistsStateDefault,
})
@Injectable()
export class ArtistsState {
  constructor(private apiService: ApiService) { }

  @Selector()
  static artists(state: IArtistsState) {
    return state.artists;
  }

  @Selector()
  static artistDetails(state: IArtistsState) {
    return (artist: string) => {
      return state.artists[artist];
    };
  }

  @Action(ArtistsAction)
  _artistList(ctx: StateContext<IArtistsState>, { uid }: ArtistsAction) {
    return this.apiService.artists(uid).pipe(
      tap((data) => {
        ctx.patchState({
          artists: data,
        });
      })
    )
  }

  @Action(ArtistSongsAction)
  _artistSongs(ctx: StateContext<IArtistsState>, { uid, artistPlatform }: ArtistSongsAction) {
    return this.apiService.artistSongs(uid, artistPlatform).pipe(
      tap((data) => {
        console.log(data);
        // ctx.patchState({
        //   artists: data,
        // });
      })
    )
  }

}
