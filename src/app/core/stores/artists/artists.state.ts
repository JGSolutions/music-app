import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ArtistsAction } from './artists.actions';
import { artistsStateDefault, IArtistsState } from './artists.types';

@State<IArtistsState>({
  name: 'artists',
  defaults: artistsStateDefault,
})
@Injectable()
export class ArtistsState {
  constructor(private apiService: ApiService) {}

  @Selector()
  static artists(state: IArtistsState) {
    return state.artists;
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

}
