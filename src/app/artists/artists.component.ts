import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { IArtists, IPlatformTypes } from 'models/artist.types';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from '../core/stores/connected-services/connected-services.types';
import { isUndefined as _isUndefined } from 'lodash';
import { SelectArtistAction } from '../core/stores/artists/artists.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(ConnectedServicesState.servicesList) connectedServices$!: Observable<ConnectedServicesList[]>;

  public artistsFiltered$ = this.store.select(ArtistsState.artistsByPlatform);
  public artistDetails$ = this.store.select(ArtistsState.artistDetails);
  public artistsByPlatform$!: Observable<Record<string, IArtists[]>>;

  private _connectServiceType$ = new BehaviorSubject<IPlatformTypes>(IPlatformTypes.all);

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.artistsByPlatform$ = combineLatest([this._connectServiceType$, this.artistsFiltered$]).pipe(
      map(([platform, artistsFiltered]) => artistsFiltered(platform))
    );
  }

  public selectedPlatform(evt: any) {
    this._connectServiceType$.next(evt);
  }

  public selectArtist(key: string): void {
    this.artistDetails$.pipe(
      take(1),
      map((artist) => artist(key))
    ).subscribe(artistDetails => {
      this.store.dispatch(new SelectArtistAction(artistDetails)).subscribe(() => {
        this.router.navigate(["/", "artist", key]);
      })
    });
  }
}
