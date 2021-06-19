import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-artist-avatar',
  templateUrl: './artist-avatar.component.html',
  styleUrls: ['./artist-avatar.component.scss']
})
export class ArtistAvatarComponent {
  @Input()
  artistName!: string;

  @Input()
  avatar!: string;

  @Input()
  genres!: string[];

  @Input()
  platform!: string;
}

