import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { IArtists } from 'functions/src/models/IArtists.types';
import { Observable } from 'rxjs';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServices } from '../core/stores/connected-services/connected-services.types';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  @Select(ArtistsState.artists) artists$!: Observable<IArtists[]>;
  @Select(ConnectedServicesState.services) connectedServices$!: Observable<ConnectedServices>;

  constructor() { }

  ngOnInit(): void {
  }

}
