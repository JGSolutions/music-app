import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-album-avatar',
  templateUrl: './album-avatar.component.html',
  styleUrls: ['./album-avatar.component.scss']
})
export class AlbumAvatarComponent {
  @Input()
  name!: string;

  @Input()
  loading!: boolean;

  @Input()
  artist!: string;

  @Input()
  avatar!: string;

  @Input()
  genres!: string[];

  @Input()
  platform!: string;

  @Input()
  releaseDate!: string;

  @Input()
  totalTracks!: number;
}

