import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { IArtists } from 'functions/src/models/IArtists.types';
import { reduce } from "lodash";
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

  public connectedServices = IConnectedServicesTypes;
  public selectedChip: IConnectedServicesTypes = this.connectedServices.all;
  public artistsByPlatform$!: Observable<Record<string, IArtists[]>>;

  private _artistsByPlatform$ = new BehaviorSubject<IConnectedServicesTypes>(IConnectedServicesTypes.all);

  ngOnInit(): void {
    this.artistsByPlatform$ = combineLatest([this._artistsByPlatform$, this.artists$]).pipe(
      map(([platform, artists]) => {
        if (platform === IConnectedServicesTypes.all) {
          return artists;
        }

        return reduce(artists, (acc: any, value, key) => {
          const foundArtist = value.filter((v) => {
            return v.platform === platform as string;
          });

          if (foundArtist.length > 0) {
            acc[key] = foundArtist;
          }

          return acc;
        }, {} as Record<string, IArtists[]>);

      })
    );
  }

  public selectChip(evt: IConnectedServicesTypes): void {
    this._artistsByPlatform$.next(evt);
  }
}
