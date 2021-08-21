import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ArtistsAction, SelectArtistAction } from './artists.actions';
import { artistsStateDefault, IArtistsState } from './artists-state.types';
import { reduce, orderBy as _orderBy } from 'lodash';
import { IArtists, IPlatformTypes } from 'models/artist.types';

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

  @Selector()
  static artistsByPlatform(state: IArtistsState) {
    return (platform: IPlatformTypes) => {
      if (platform === IPlatformTypes.all) {
        return state.artists;
      }

      return reduce(state.artists, (acc: any, value, key) => {
        const foundArtist = value.filter((element) => {
          return element.platform === platform as string;
        });

        if (foundArtist.length > 0) {
          acc[key] = foundArtist;
        }

        return acc;
      }, {} as Record<string, IArtists[]>);
    };
  }

  @Selector()
  static loading(state: IArtistsState) {
    return state.loading;
  }

  @Action(ArtistsAction)
  _artistList(ctx: StateContext<IArtistsState>, { uid }: ArtistsAction) {
    return this.apiService.artists(uid!).pipe(
      tap((data) => {
        ctx.patchState({
          artists: data,
        });
      })
    )
  }

  @Action(SelectArtistAction)
  _selectArtist(ctx: StateContext<IArtistsState>, { artist }: SelectArtistAction) {
    ctx.patchState({
      selectedArtist: artist,
    });
  }
}
