import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, map, Observable, shareReplay, Subject, take, takeUntil, tap } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { PlaylistDetailAction, PlaylistTrackSelectionAction } from '../core/stores/playlist/playlist.actions';
import { ActivatedRoute } from '@angular/router';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { ICurrentTrack } from '../core/stores/songs/songs.types';
import { SongsState } from '../core/stores/songs/songs.state';
import { SetCurrentSelectedSongAction } from '../core/stores/songs/songs.actions';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IPlayListDetails } from 'models/playlist.types';
import { IPlatformTypes } from 'models/artist.types';
import { isEmpty  as _isEmpty } from 'lodash';
import { IDurationType } from 'models/song.types';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(PlaylistState.playlistDetail) playlistDetail$!: Observable<IPlayListDetails>;
  @Select(PlaylistState.playListSelected) playListSelected$!: Observable<string[]>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  public playlistid!: string;
  public platform!: IPlatformTypes;
  public totalTrackMinutes$!: Observable<number>;
  public durationTypes = IDurationType;

  private destroy$ = new Subject<void>();
  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private store: Store, private route: ActivatedRoute, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.playlistid = this.route.snapshot.params.playlistid;
    this.platform = this.route.snapshot.params.platform;

    this.user$.pipe(
      filter((user) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      this.store.dispatch(new PlaylistDetailAction(user.uid!, this.playlistid!, this.platform));
    });

    this.totalTrackMinutes$ = this.playlistDetail$.pipe(
      filter(playlistDetails => !_isEmpty(playlistDetails)),
      map((playlistDetails: IPlayListDetails) => {
        let totalDuration = 0;
        playlistDetails.tracks.forEach((track) => {
          totalDuration = totalDuration + track.duration;
        })
        return totalDuration;
      }),
      shareReplay()
    )
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  public stop(evt: MouseEvent) {
    evt.stopPropagation()
  }

  public selectedSong(selectedSong: string): void {
    this.currentTrack$.pipe(
      take(1),
      filter((currentTrack) => currentTrack?.id !== selectedSong)
    ).subscribe(() => {
      this.store.dispatch([new SetCurrentSelectedSongAction(selectedSong, "playlist")]);
    })
  }

  public removeSong(trackid: string): void {
    this.user$.pipe(
      take(1)
    ).subscribe(user => {
      this.openSnackBar();
    })
  }

  public openSnackBar() {
    this._snackBar.open('Playlist track has been removed!', '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000,
    });
  }

  public tracksSelected(evt: MatSelectionListChange) {
    this.store.dispatch(new PlaylistTrackSelectionAction(evt.source.selectedOptions.selected.map(s => s.value)))
  }

  public deletePlaylist() {

  }
}
