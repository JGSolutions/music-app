import { Component, Input } from '@angular/core';
import { IAvatar } from 'models/avatar.types';
import { Observable } from 'rxjs';
import { ICoverImages } from 'src/app/core/stores/playlist/playlist.types';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent {
  @Input()
  playlistName!: string;

  @Input()
  coverImages!: ICoverImages[];

  public avatar$!: Observable<IAvatar>;
  public platforms$!: Observable<string[]>;
}

