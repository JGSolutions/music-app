import { Component, Input, OnInit } from '@angular/core';
import { IArtists } from 'functions/src/models/IArtists.types';
import { Pictures } from 'functions/src/models/IPictures.types';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {
  @Input()
  artistName!: string;

  @Input() set artistDetails(value: IArtists[]) {
    this._artistDetails$.next(value);
  }

  public avatar$!: Observable<Pictures>;
  public platforms$!: Observable<string[]>;

  private _artistDetails$ = new ReplaySubject(1);

  constructor() { }

  ngOnInit(): void {
    this.avatar$ = this._artistDetails$.pipe(
      map((artistDetails: any) => {
        const randomIdx = Math.floor(Math.random() * 1);
        return artistDetails[randomIdx].pictures;
      })
    );

    this.platforms$ = this._artistDetails$.pipe(
      map((artistDetails: any) => {
        return artistDetails.map((artist: any) => artist.platform)
      })
    );
  }

}
