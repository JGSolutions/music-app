import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists, IArtistSongs } from 'functions/src/models/IArtists.types';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { isUndefined } from 'lodash';
import { ArtistSongsAction } from '../core/stores/artists/artists.actions';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServicesList, IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';
@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ConnectedServicesState.servicesList) connectedServices$!: Observable<ConnectedServicesList[]>;
  public artistDetails$ = this.store.select(ArtistsState.artistDetails);
  public songsByPlatform$ = this.store.select(ArtistsState.songsByPlatform);
  public artist!: string;
  public profileDetails$!: Observable<IArtists>;
  public songs$!: Observable<IArtistSongs[]>;
  private destroy$ = new Subject<boolean>();

  private _connectServiceType$ = new BehaviorSubject<IConnectedServicesTypes>(IConnectedServicesTypes.all);

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.artist = this.route.snapshot.params.artist;

    const artistDetails$ = this.artistDetails$.pipe(
      map((artist) => artist(this.artist)),
      filter(data => !isUndefined(data)),
      shareReplay(1)
    );

    /**
     * Details for artist profile
     */
    this.profileDetails$ = artistDetails$.pipe(
      map((artists) => artists[0]),
      filter(data => !isUndefined(data)),
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

    this.songs$ = combineLatest([this._connectServiceType$, this.songsByPlatform$]).pipe(
      map(([platform, songsByPlatform]) => songsByPlatform(platform))
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedPlatform(evt: any) {
    this._connectServiceType$.next(evt);
  }
}
