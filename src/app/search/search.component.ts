import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { SongsState } from '../core/stores/songs/songs.state';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  // @Select(PlaylistState.playlistDetail) playlistDetail$!: Observable<IPlaylist>;

  public playlistSongsByPlatform$ = this.store.select(SongsState.playlistSongsByPlatform);

  // public songs$!: Observable<ISongCommonState[]>;

  private destroy$ = new Subject<boolean>();

  constructor(private store: Store, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // this.playlistid = this.route.snapshot.params.playlistid;

    // this.user$.pipe(
    //   filter((user) => user !== null),
    //   takeUntil(this.destroy$)
    // ).subscribe((user) => {
    //   this.store.dispatch(new AllPlaylistTracksAction(this.playlistid!, user.uid!));
    //   this.store.dispatch(new PlaylistDetailAction(this.playlistid!));
    // });

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
