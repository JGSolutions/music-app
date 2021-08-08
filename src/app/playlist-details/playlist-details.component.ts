import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { AllPlaylistTracksAction, PlaylistDetailAction } from '../core/stores/playlist/playlist.actions';
import { ActivatedRoute } from '@angular/router';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { IPlaylist, ISelectedPlaylist } from '../core/stores/playlist/playlist.types';
import { ICurrentTrack } from '../core/stores/songs/songs.types';
import { LoadingPlayerAction } from '../core/stores/player/player.actions';
import { SetCurrentSelectedSongAction } from '../core/stores/artists/artists.actions';
import { SongsState } from '../core/stores/songs/songs.state';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(PlaylistState.playlistDetail) playlistDetail$!: Observable<IPlaylist>;
  @Select(PlaylistState.allPlaylistTracks) allPlaylistTracks$!: Observable<ISelectedPlaylist[]>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  public playlistid!: string;
  private destroy$ = new Subject<boolean>();

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.playlistid = this.route.snapshot.params.playlistid;

    this.user$.pipe(
      filter((user) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      this.store.dispatch(new AllPlaylistTracksAction(this.playlistid!, user.uid!));
      this.store.dispatch(new PlaylistDetailAction(this.playlistid!));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedSong(selectedSong: string): void {
    this.currentTrack$.pipe(
      take(1),
      filter((currentTrack) => currentTrack?.id !== selectedSong)
    ).subscribe(() => {
      this.store.dispatch([new LoadingPlayerAction(true), new SetCurrentSelectedSongAction(selectedSong)]);
    })
  }
}
