import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { PlaylistService } from 'src/app/services/playlist.service';
import { AddToPlaylistAction, CreatePlaylistAction, DeletePlaylistAction, PlaylistDataAction, PlaylistDeleteTracksAction, PlaylistDetailAction, PlaylistTrackDataAction, PlaylistTrackSelectionAction, RemoveToPlaylistAction } from './playlist.actions';
import { IPlayerlistState, playerlistStateDefault } from './playlist.types';
import { cloneDeep as _cloneDeep, isUndefined as _isUndefined } from 'lodash';
import { IPlayListDetails } from 'models/playlist.types';

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

  @Selector()
  static playlistDetail(state: IPlayerlistState) {
    return state.playlistDetail;
  }

  @Selector()
  static playlistTracks(state: IPlayerlistState) {
    return state.playlistTracks;
  }

  @Selector()
  static playlistTrackIds(state: IPlayerlistState) {
    // return state.playlistTrack.playlists;
  }

  @Selector()
  static playListSelected(state: IPlayerlistState) {
    return state.playListSelected;
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
    return this.playlistService.playlists(uid).pipe(
      tap(data => {
        ctx.patchState({
          playlistData: data,
          loadingPlaylist: false
        });
      })
    );
  }

  @Action(AddToPlaylistAction)
  _addToPlaylistData({ getState }: StateContext<IPlayerlistState>, { selectedSong, selectedPlaylist, uid }: AddToPlaylistAction) {
    // let clonedState = _cloneDeep(getState().playlistTrack);
    // const playlistTrackData = (_isUndefined(clonedState)) ? selectedSong : clonedState

    // const playlistsIDs = new Set(playlistTrackData?.playlists);

    // playlistsIDs.add(selectedPlaylist);
    // playlistTrackData.playlists = [...playlistsIDs];

    // return this.playlistService.updateSelectedPlaylistTracks(playlistTrackData, uid);
  }

  @Action(RemoveToPlaylistAction)
  async _removeToPlaylistData({ getState }: StateContext<IPlayerlistState>, { selectedPlaylist, uid }: RemoveToPlaylistAction) {
    // let playlistTrackData = _cloneDeep(getState().playlistTrack);

    // const playlistsIDs = new Set(playlistTrackData?.playlists);
    // playlistsIDs.delete(selectedPlaylist);
    // playlistTrackData.playlists = [...playlistsIDs];

    // if (playlistTrackData.playlists.length === 0) {
    //   return this.playlistService.deleteSelectedPlaylist(playlistTrackData.id!, uid);
    // } else {
    //   return this.playlistService.updateSelectedPlaylistTracks(playlistTrackData, uid);
    // }
  }

  @Action(PlaylistTrackDataAction)
  _playlistTrackDataAction(ctx: StateContext<IPlayerlistState>, { uid, songid }: PlaylistTrackDataAction) {
    return this.playlistService.getPlaylistTrack(uid, songid).pipe(
      tap(data => {
        // ctx.patchState({
        //   playlistTrack: data as ISelectedPlaylist
        // });
      })
    );
  }

  @Action(PlaylistDetailAction)
  _playlistDetailAction(ctx: StateContext<IPlayerlistState>, { uid, playlistid, platform }: PlaylistDetailAction) {
    return this.playlistService.playlistDetails(uid, playlistid, platform).pipe(
      tap((data: IPlayListDetails) => {
        ctx.patchState({
          playlistDetail: data,
          playlistTracks: data.tracks,
          uid,
          platform,
          playlistid
        });
      })
    );
  }

  @Action(PlaylistTrackSelectionAction)
  _playlistTrackSelectionAction(ctx: StateContext<IPlayerlistState>, { playlistIds }: PlaylistTrackSelectionAction) {
    ctx.patchState({
      playListSelected: playlistIds
    });
  }

  @Action(DeletePlaylistAction)
  _deletePlaylistAction(ctx: StateContext<IPlayerlistState>) {
    const state = ctx.getState();

    return this.playlistService.deletePlaylist(state.uid, state.playlistid, state.platform);
  }

  @Action(PlaylistDeleteTracksAction)
  _playlistDeleteTracksAction(ctx: StateContext<IPlayerlistState>) {
    const state = ctx.getState();
    return this.playlistService.deletePlaylistTracks(state.uid, state.playlistid, state.platform, state.playListSelected).pipe(
      tap(() => {
        ctx.patchState({
          playlistTracks: state.playlistTracks.filter((track) => !state.playListSelected.includes(track.id)),
        });
      })
    );
  }
}
