import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { ArtistsAction } from '../core/stores/artists/artists.actions';
import { isEmpty } from 'lodash';
import { IPlatformTypes } from 'models/artist.types';
import { ICurrentTrack } from '../core/stores/songs/songs.types';
import { AddHistoryAction } from '../core/stores/history/history.actions';
import { SongsState } from '../core/stores/songs/songs.state';
import { GetCurrentSelectedTrackAction, SaveCurrentSelectedSongAction } from '../core/stores/songs/songs.actions';

@Component({
  selector: 'app-player',
  templateUrl: 'app-player.component.html',
  styleUrls: ['app-player.component.scss'],
})
export class AppPlayerComponent implements OnDestroy, OnInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

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
      this.store.dispatch([new ArtistsAction(user!.uid), new GetCurrentSelectedTrackAction(user!.uid!)]);
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

  public trackHistory(currentTrack: any): void {
    this.user$.pipe(
      take(1)
    ).subscribe((user) => {
      this.store.dispatch([new SaveCurrentSelectedSongAction(user!.uid!), new AddHistoryAction(user!.uid!, {
        name: currentTrack.name,
        dateViewed: new Date,
        platform: currentTrack.platform,
        id: currentTrack.id,
        trackType: currentTrack.trackType,
        artist: currentTrack.artist,
        externalUrl: currentTrack.externalUrl,
        avatar: currentTrack.avatar,
        audioFile: currentTrack.audioFile || ''
      })]);
    })

  }
}
