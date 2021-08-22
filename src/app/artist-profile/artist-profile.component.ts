import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { isUndefined as _isUndefined, isEmpty as _isEmpty } from 'lodash';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { IArtists } from 'models/artist.types';
import { ArtistSongsAction, ClearSongs } from '../core/stores/songs/songs.actions';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;

  public artistDetails$ = this.store.select(ArtistsState.artistDetails);
  public artist!: string;
  public profileDetails$!: Observable<IArtists>;
  public artistGenres$!: Observable<string[]>;

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ClearSongs());
    this.artist = this.route.snapshot.params.artist;

    const artistDetails$ = this.artistDetails$.pipe(
      map((artist) => artist(this.artist)),
      filter(data => !_isUndefined(data)),
      shareReplay(1)
    );
    /**
     * Details for artist profile
     */
    this.profileDetails$ = artistDetails$.pipe(
      map((artists) => artists[0]),
      filter(data => !_isUndefined(data)),
      shareReplay(1)
    );

    /**
     * Gets list of songs for artist
     */
    artistDetails$.pipe(
      take(1),
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

    this.artistGenres$ = artistDetails$.pipe(
      map((details) => {
        return details.reduce((acc, value) => {
          if (value.genres) {
            acc = value.genres.map(genre => genre);
          }

          return acc;
        }, [] as string[]);
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
