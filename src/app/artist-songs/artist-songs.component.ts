import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import { isUndefined as _isUndefined, isEmpty as _isEmpty } from 'lodash';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { IArtists } from 'models/artist.types';
import { ArtistSongsAction, ClearSongs } from '../core/stores/songs/songs.actions';
import { SongsState } from '../core/stores/songs/songs.state';

@Component({
  selector: 'app-artist-songs-view',
  templateUrl: './artist-songs.component.html',
  styleUrls: ['./artist-songs.component.scss']
})
export class ArtistSongsViewComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SongsState.artistInfo) artist$!: Observable<IArtists>;

  public artist!: string;
  public profileDetails$!: Observable<IArtists>;
  public artistGenres$!: Observable<string[]>;
  public songsByPlatform$ = this.store.select(SongsState.songsByPlatform);

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.store.dispatch(new ClearSongs());

    combineLatest([this.user$, this.route.queryParams]).pipe(
      takeUntil(this.destroy$),
      filter(([user]) => user !== null)
    ).subscribe(([user, queryParams]) => {
      this.store.dispatch(new ArtistSongsAction(user.uid, [{
        type: queryParams.platform,
        id: queryParams.id,
        username: queryParams.username
      }]))
    });

    this.artistGenres$ = this.artist$.pipe(
      filter(details => !_isEmpty(details)),
      map((details) => {

        if (details.genres) {
          return details.genres
        }

        return [];
      }),
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
