import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ArtistAlbumSongs, ArtistsAction, ArtistSongsAction, SaveCurrentSelectedSongAction, GetCurrentSelectedTrackAction } from './artists.actions';
import { artistsStateDefault, IArtistsState, ICurrentTrack } from './artists-state.types';
import { reduce } from 'lodash';
import { IArtists, IPlatformTypes } from 'models/artist.types';
import { IAlbum } from 'models/song.types';
import { CurrentTrackService } from 'src/app/services/current-track.service';

@State<IArtistsState>({
  name: 'artists',
  defaults: artistsStateDefault,
})
@Injectable()
export class ArtistsState {
  constructor(private apiService: ApiService, private _currentTrack: CurrentTrackService) { }

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
  static artistAlbum(state: IArtistsState) {
    return state.artistAlbum;
  }

  @Selector()
  static songsByPlatform(state: IArtistsState) {
    return (platform: IPlatformTypes) => {
      if (platform === IPlatformTypes.all) {
        return state.artistSongs;
      }

      return state.artistSongs.filter((element) => {
        return element.platform === platform as string;
      });
    };
  }

  @Selector()
  static songDetailById(state: IArtistsState) {
    return (id: string) => state.artistSongs.find((song) => song.id === id);
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
  static currentTrack(state: IArtistsState) {
    return state.currentTrack;
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

  @Action(ArtistAlbumSongs)
  _artistAlbumSongs(ctx: StateContext<IArtistsState>, { uid, platform, id }: ArtistAlbumSongs) {
    return this.apiService.artistAlbum(uid!, platform, id).pipe(
      tap((data: IAlbum) => {
        ctx.patchState({
          artistSongs: data.tracks,
          artistAlbum: data.album
        });
      })
    )
  }

  @Action(SaveCurrentSelectedSongAction)
  async _setCurrentSelectedSongAction({ getState }: StateContext<IArtistsState>, { uid, id }: SaveCurrentSelectedSongAction) {
    const state = getState();

    const song = state.artistSongs.find((song) => song.id === id);

    const currentTrack: ICurrentTrack = {
      platform: song!.platform,
      name: song!.name,
      trackType: song!.trackType,
      artist: song?.artistName,
      externalUrl: song?.externalUrl,
      avatar: song?.pictures?.medium,
      id: song?.id!
    };

    await this._currentTrack.saveCurrentTrack(uid, currentTrack);
  }

  @Action(GetCurrentSelectedTrackAction)
  _getCurrentSelectedTrackAction({ patchState }: StateContext<IArtistsState>, { uid }: GetCurrentSelectedTrackAction) {
    return this._currentTrack.getCurrentTrack(uid).pipe(
      tap((currentTrack) => {
        patchState({
          currentTrack
        });
      })
    );
  }
}
