import { Component, Input, OnInit } from '@angular/core';
import { IAvatar } from 'models/avatar.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {
  @Input()
  playlistName!: string;

  public avatar$!: Observable<IAvatar>;
  public platforms$!: Observable<string[]>;

  ngOnInit(): void {
    // this.avatar$ = this._artistDetails$.pipe(
    //   map((artistDetails: any) => {
    //     const randomIdx = Math.floor(Math.random() * 1);
    //     return artistDetails[randomIdx].pictures;
    //   })
    // );

  }
}

