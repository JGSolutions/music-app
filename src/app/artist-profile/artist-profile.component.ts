import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'functions/src/models/IArtists.types';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { isUndefined } from 'lodash';
import { ArtistSongsAction } from '../core/stores/artists/artists.actions';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(UserState.userState) user$!: Observable<IUserType>;

  public artistDetails$ = this.store.select(ArtistsState.artistDetails);
  public artist!: string;

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.artist = this.route.snapshot.params.artist;

    const artistDetails$ = this.artistDetails$.pipe(
      map((artist) => artist(this.artist)),
      filter(data => !isUndefined(data)),
      shareReplay(1)
    );

    artistDetails$.pipe(
      map((details) => {
        return details.map((detail) => {
          return {
            type: detail.platform,
            id: detail.id,
            username: detail.username
          }
        })
      }),
      withLatestFrom(this.user$),
      takeUntil(this.destroy$)
    ).subscribe(([data, user]) => {
      this.store.dispatch(new ArtistSongsAction(user.uid, data))
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
