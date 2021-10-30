import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPlatformTypes } from 'models/artist.types';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistItemComponent {
  @Input()
  playlistName!: string;

  @Input()
  coverImage!: string;

  @Input()
  platform!: IPlatformTypes;


}

