import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ArtistClearSongs } from '../core/stores/artists/artists.actions';
import { IArtists } from 'models/artist.types';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;

  public artistDetails$ = this.store.select(ArtistsState.artistDetails);

  private destroy$ = new Subject<boolean>();

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
