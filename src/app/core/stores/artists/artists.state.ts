import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { IConnectedServicesTypes } from '../connected-services/connected-services.types';
import { ArtistsAction, ArtistSongsAction } from './artists.actions';
import { artistsStateDefault, IArtistsState } from './artists.types';
import { reduce } from 'lodash';
import { IArtists } from 'functions/src/models/IArtists.types';

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
  static artistSongs(state: IArtistsState) {
    return state.artistSongs;
  }

  @Selector()
  static songsByPlatform(state: IArtistsState) {
    return (platform: IConnectedServicesTypes) => {
      if (platform === IConnectedServicesTypes.all) {
        return state.artistSongs;
      }

      return state.artistSongs.filter((element) => {
        return element.platform === platform as string;
      });
    };
  }

  @Selector()
  static artistsByPlatform(state: IArtistsState) {
    return (platform: IConnectedServicesTypes) => {
      if (platform === IConnectedServicesTypes.all) {
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
        ctx.patchState({
          artistSongs: data,
        });
      })
    )
  }

}
