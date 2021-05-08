import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'functions/src/models/IArtists.types';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServicesList, IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(ConnectedServicesState.servicesList) connectedServices$!: Observable<ConnectedServicesList[]>;
  public artistsFiltered$ = this.store.select(ArtistsState.artistsByPlatform);

  public artistsByPlatform$!: Observable<Record<string, IArtists[]>>;

  private _connectServiceType$ = new BehaviorSubject<IConnectedServicesTypes>(IConnectedServicesTypes.all);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.artistsByPlatform$ = combineLatest([this._connectServiceType$, this.artistsFiltered$]).pipe(
      map(([platform, artistsFiltered]) => artistsFiltered(platform))
    );
  }

  public selectedPlatform(evt: any) {
    this._connectServiceType$.next(evt);
  }
}
