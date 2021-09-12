import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ArtistAlbumSongs, ArtistSongsAction, SaveCurrentSelectedSongAction, GetCurrentSelectedTrackAction, AudioFileAction, SetCurrentSelectedSongAction, SetCurrentTrackPlayStatusAction, ClearSongs, AllPlaylistTracksAction, LoadingPlayerAction, SetCurrentSongAction, SoundcloudAudioFileAction, CloseCurrentTrackAction } from './songs.actions';
import { songsStateDefault, ISongsState, ICurrentTrack, ISongCommonState } from './songs.types';
import { cloneDeep, orderBy as _orderBy } from 'lodash';
import { IPlatformTypes } from 'models/artist.types';
import { IAlbum } from 'models/song.types';
import { CurrentTrackService } from 'src/app/services/current-track.service';
import { PlaylistService } from 'src/app/services/playlist.service';

@State<ISongsState>({
  name: 'songs',
  defaults: songsStateDefault,
})
@Injectable()
export class SongsState {
  constructor(private apiService: ApiService, private _currentTrack: CurrentTrackService, private playlistService: PlaylistService) { }

  @Selector()
  static allPlaylistTracks(state: ISongsState) {
    return state.playlistSongs;
  }

  @Selector()
  static songs(state: ISongsState) {
    return state.songs;
  }

  @Selector()
  static artistInfo(state: ISongsState) {
    return state.artist;
  }

  @Selector()
  static artistAlbum(state: ISongsState) {
    return state.artistAlbum;
  }

  @Selector()
  static songsByPlatform(state: ISongsState) {
    return (platform: IPlatformTypes) => {
      const data = _orderBy(state.songs, ['createdTime'], ['desc']);
      if (platform === IPlatformTypes.all) {
        return data;
      }

      return data.filter((element) => {
        return element.platform === platform as string;
      });
    };
  }

  @Selector()
  static playlistSongsByPlatform(state: ISongsState) {
    return (platform: IPlatformTypes) => {
      const data = _orderBy(state.playlistSongs, ['createdTime'], ['desc']);
      if (platform === IPlatformTypes.all) {
        return data;
      }

      return data.filter((element) => {
        return element.platform === platform as string;
      });
    };
  }

  @Selector()
  static songDetailById(state: ISongsState) {
    return (id: string) => state.songs.find((song) => song.id === id);
  }

  @Selector()
  static currentTrack(state: ISongsState) {
    return state.currentTrack;
  }

  @Selector()
  static audioFile(state: ISongsState) {
    return state.currentTrack.audioFile;
  }

  @Selector()
  static songsLoading(state: ISongsState) {
    return state.songsLoading;
  }

  @Selector()
  static loading(state: ISongsState) {
    return state.loading;
  }

  @Selector()
  static currentTrackLoading(state: ISongsState) {
    return state.currentTrackLoading;
  }

  @Selector()
  static soundcloudStreamUrls(state: ISongsState) {
    return state.soundcloudStreamUrls;
  }

  @Action(ArtistSongsAction)
  _artistSongs(ctx: StateContext<ISongsState>, { uid, artistPlatform }: ArtistSongsAction) {
    ctx.patchState({
      songsLoading: true
    });
    return this.apiService.artistSongs(uid, artistPlatform).pipe(
      tap((data) => {
        ctx.patchState({
          songs: data.tracks,
          artist: data.artists[0],
          songsLoading: false
        });
      })
    )
  }

  @Action(ClearSongs)
  _artistClearSongs(ctx: StateContext<ISongsState>) {
    ctx.patchState({
      songs: [],
      artistAlbum: undefined,
      artist: undefined,
    });
  }

  @Action(ArtistAlbumSongs)
  _artistAlbumSongs(ctx: StateContext<ISongsState>, { uid, platform, id }: ArtistAlbumSongs) {
    ctx.patchState({
      songsLoading: true
    });
    return this.apiService.artistAlbum(uid!, platform, id).pipe(
      tap((data: IAlbum) => {
        ctx.patchState({
          songs: data.tracks,
          artistAlbum: data.album,
          songsLoading: false
        });
      })
    )
  }

  @Action(SaveCurrentSelectedSongAction)
  async _saveCurrentSelectedSongAction({ getState }: StateContext<ISongsState>, { uid }: SaveCurrentSelectedSongAction) {
    const state = getState();
    await this._currentTrack.saveCurrentTrack(uid, state.currentTrack);
  }

  @Action(SetCurrentSelectedSongAction)
  _setCurrentSelectedSongAction({ getState, patchState }: StateContext<ISongsState>, { id, type }: SetCurrentSelectedSongAction) {
    const state = getState();

    const song = type === "songs" ? state.songs.find((song) => song.id === id) : state.playlistSongs.find((song) => song.id === id);

    const currentTrack: ICurrentTrack = {
      platform: song!.platform,
      name: song!.name,
      trackType: song!.trackType,
      artist: song?.artist || [],
      externalUrl: song?.externalUrl || "",
      avatar: song?.pictures,
      duration: song?.duration,
      durationType: song?.durationType,
      audioFile: song?.streamUrl || "",
      isPlaying: false,
      createdTime: song?.createdTime,
      id: song?.id!,
      albumid: song?.albumid || ""
    };

    patchState({
      currentTrack
    });
  }

  @Action(GetCurrentSelectedTrackAction, { cancelUncompleted: true })
  _getCurrentSelectedTrackAction({ patchState }: StateContext<ISongsState>, { uid }: GetCurrentSelectedTrackAction) {
    patchState({
      currentTrackLoading: true
    });
    return this._currentTrack.getCurrentTrack(uid).pipe(
      tap((currentTrack) => {
        patchState({
          currentTrack,
          currentTrackLoading: false
        });
      })
    );
  }

  @Action(CloseCurrentTrackAction, { cancelUncompleted: true })
  _closeCurrentSelectedTrackAction({ patchState }: StateContext<ISongsState>, { uid }: CloseCurrentTrackAction) {
    return this._currentTrack.deleteTrack(uid);
  }

  @Action(AudioFileAction, { cancelUncompleted: true })
  _audioFileAction({ getState, patchState }: StateContext<ISongsState>, { uid, externalUrl }: AudioFileAction) {
    patchState({
      loading: true
    });
    return this.apiService.mixcloudAudioStream(uid!, externalUrl!).pipe(
      tap((audioFile) => {
        const currentTrack = cloneDeep(getState().currentTrack);
        currentTrack.audioFile = audioFile.url;
        patchState({
          currentTrack,
        });
      })
    )
  }

  @Action(SoundcloudAudioFileAction, { cancelUncompleted: true })
  _soundcloudAudioFileAction({ patchState }: StateContext<ISongsState>, { uid, externalUrl }: SoundcloudAudioFileAction) {
    patchState({
      loading: true
    });
    return this.apiService.soundcloudAudioStream(uid!, externalUrl!).pipe(
      tap((urls) => {
        patchState({
          soundcloudStreamUrls: urls,
          loading: false
        });
      })
    );
  }

  @Action(SetCurrentTrackPlayStatusAction, { cancelUncompleted: true })
  _setCurrentTrackPlayStatusAction({ getState, patchState }: StateContext<ISongsState>, { isPlaying }: SetCurrentTrackPlayStatusAction) {
    const currentTrack = cloneDeep(getState().currentTrack);
    currentTrack.isPlaying = isPlaying;

    patchState({
      currentTrack
    });
  }

  @Action(AllPlaylistTracksAction)
  _allPlaylistTrackDataAction(ctx: StateContext<ISongsState>, { playlistid, uid }: AllPlaylistTracksAction) {
    return this.playlistService.getAllPlaylistTrack(playlistid, uid).pipe(
      tap(data => {
        ctx.patchState({
          playlistSongs: data as ISongCommonState[],
        });
      })
    );
  }

  @Action(LoadingPlayerAction)
  _loadingPlayerAction(ctx: StateContext<ISongsState>, { loading }: LoadingPlayerAction) {
    ctx.patchState({
      loading
    });
  }

  @Action(SetCurrentSongAction)
  _setCurrentSongAction({ patchState }: StateContext<ISongsState>, { currentTrack }: SetCurrentSongAction) {
    patchState({
      currentTrack
    });
  }
}

