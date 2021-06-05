import { Component, Input, OnInit } from '@angular/core';
import { IArtists } from 'models/artist.types';
import { IAvatar } from 'models/avatar.types';
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

  private _artistDetails$ = new ReplaySubject<IArtists[]>(1);
  /**
   * Suppose to be IArtists type but not sure why and seems an issue
   * with typescript
   */
  @Input() set artistDetails(value: any) {
    this._artistDetails$.next(value);
  }

  public avatar$!: Observable<IAvatar>;
  public platforms$!: Observable<string[]>;

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

