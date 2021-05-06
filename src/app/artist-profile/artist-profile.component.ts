import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'functions/src/models/IArtists.types';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { isUndefined } from 'lodash';
@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  public artistDetails$ = this.store.select(ArtistsState.artistDetails);

  public artist!: string;

  constructor(private route: ActivatedRoute, private store: Store) {

  }

  ngOnInit(): void {
    this.artist = this.route.snapshot.params.artist;

    this.artistDetails$.pipe(
      map((artist) => artist(this.artist)),
      filter(data => !isUndefined(data))
    );

    // [
    //   {"type": "spotify", "id": "6OO0PboZcIWUWL7j2IyeoL", "username": "MarkusSchulz"},
    //   {"type": "mixcloud", "id": "MarkusSchulz", "username": "MarkusSchulz"}
    //   ]
    // })
  }

}
