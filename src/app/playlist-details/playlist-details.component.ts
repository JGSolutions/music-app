import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { PlaylistDataAction } from '../core/stores/playlist/playlist.actions';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { IPlaylist } from '../core/stores/playlist/playlist.types';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(PlaylistState.playlist) playlist$!: Observable<IPlaylist[]>;

  public artistDetails$ = this.store.select(ArtistsState.artistDetails);

  private destroy$ = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user$.pipe(
      filter((user) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      this.store.dispatch(new PlaylistDataAction(user.uid!));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
