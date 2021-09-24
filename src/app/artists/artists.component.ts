import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'models/artist.types';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { isUndefined as _isUndefined } from 'lodash';
import { SelectArtistAction } from '../core/stores/artists/artists.actions';
import { Router } from '@angular/router';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from '../core/stores/connected-services/connected-services.types';
@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(ArtistsState.loading) loading$!: Observable<boolean>;
  @Select(ArtistsState.artistsByPlatform) artistsByPlatform$!: Observable<Record<string, IArtists[]>>;
  @Select(ConnectedServicesState.servicesList) connectedServicesList$!: Observable<ConnectedServicesList[]>;

  public artistDetails$ = this.store.select(ArtistsState.artistDetails);

  constructor(private store: Store, private router: Router) { }

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

  public selectedPlatform(evt: any) {
    // this.store.dispatch(new FilterArtistsByPlatformAction(evt));
  }
}
