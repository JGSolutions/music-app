import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { BreakpointObserver } from '@angular/cdk/layout';
import { debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import { ArtistsAction } from '../core/stores/artists/artists.actions';
import { isEmpty as _isEmpty, isUndefined as _isUndefined } from 'lodash';
import { IPlatformTypes } from 'models/artist.types';
import { ICurrentTrack } from '../core/stores/songs/songs.types';
import { AddHistoryAction } from '../core/stores/history/history.actions';
import { SongsState } from '../core/stores/songs/songs.state';
import { GetCurrentSelectedTrackAction, SaveCurrentSelectedSongAction } from '../core/stores/songs/songs.actions';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchAction } from '../core/stores/search/search.actions';
import { SearchState } from '../core/stores/search/search.state';

@Component({
  selector: 'app-player',
  templateUrl: 'app-player.component.html',
  styleUrls: ['app-player.component.scss'],
})
export class AppPlayerComponent implements OnDestroy, OnInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  @Select(SearchState.searchLoading) searchLoading$!: Observable<boolean>;

  public isMobile$: Observable<boolean>;
  public currentTrackSelected$!: Observable<boolean>;
  public platformTypes = IPlatformTypes;
  public searchControl: FormControl;
  public focusField = false;
  private destroy$ = new Subject<boolean>();

  constructor(private breakpointObserver: BreakpointObserver, private store: Store, private router: Router, private route: ActivatedRoute) {
    this.isMobile$ = this.breakpointObserver.observe('(max-width: 576px)').pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

    this.searchControl = new FormControl();
  }

  ngOnInit() {
    combineLatest([this.route.queryParams, this.user$]).pipe(
      takeUntil(this.destroy$),
      filter(([params, user]) => user !== null && !_isUndefined(params.q)),
    ).subscribe(([params, user]) => {
      this.store.dispatch(new SearchAction(params.q, user.uid!));
    });

    this.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => user !== null)
    ).subscribe((user) => {
      this.store.dispatch([new ArtistsAction(user!.uid), new GetCurrentSelectedTrackAction(user!.uid!)]);
    });

    this.currentTrackSelected$ = this.currentTrack$.pipe(
      map((currentTrack) => !_isEmpty(currentTrack)),
      shareReplay(1)
    );

    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(500),
        filter(value => value.length >= 2),
      ).subscribe((searchValue) => {
        this.router.navigate(["/", "search"], { relativeTo: this.route, queryParams: { q: searchValue } });
      });
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

  public unFocusSearchField() {
    this.focusField = false;
  }

  public focusSearchField() {
    this.focusField = true;
  }

  public submitSearch() {
    this.user$
      .pipe(
        take(1),
        switchMap((user) => this.store.dispatch(new SearchAction(this.searchControl.value, user.uid!)))
      ).subscribe(() => {
        this.router.navigate(["/", "search"]);
      });
  }
}
