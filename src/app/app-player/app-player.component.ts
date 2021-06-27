import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import { ArtistsAction, GetCurrentSelectedTrackAction } from '../core/stores/artists/artists.actions';
import { PlayerState } from '../core/stores/player/player.state';
import { isEmpty } from 'lodash';
import { IPlatformTypes } from 'models/artist.types';
import { ICurrentTrack } from '../core/stores/artists/artists-state.types';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { LoadingPlayerAction } from '../core/stores/player/player.actions';

@Component({
  selector: 'app-player',
  templateUrl: 'app-player.component.html',
  styleUrls: ['app-player.component.scss'],
})
export class AppPlayerComponent implements OnDestroy, OnInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ArtistsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  @Select(PlayerState.loadingPlayer) loadingPlayer$!: Observable<boolean>;

  public isMobile$: Observable<boolean>;
  public currentTrackSelected$!: Observable<boolean>;
  public platformTypes = IPlatformTypes;

  private destroy$ = new Subject<boolean>();

  constructor(private breakpointObserver: BreakpointObserver, private store: Store) {
    this.isMobile$ = this.breakpointObserver.observe('(max-width: 576px)').pipe(
      map((result) => result.matches),
      shareReplay(1)
    );
  }

  ngOnInit() {
    this.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => user !== null)
    ).subscribe((user) => {
      this.store.dispatch([new ArtistsAction(user.uid), new LoadingPlayerAction(true), new GetCurrentSelectedTrackAction(user.uid!)]);
    });

    this.currentTrackSelected$ = this.currentTrack$.pipe(
      map((currentTrack) => !isEmpty(currentTrack)),
      shareReplay(1)
    )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
