import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICoverImages } from 'src/app/core/stores/playlist/playlist.types';

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
  coverImages!: ICoverImages[];

  public maxImagesGrid = 4;

}

