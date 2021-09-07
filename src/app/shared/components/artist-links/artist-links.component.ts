import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IArtistName, IPlatformTypes } from 'models/artist.types';

@Component({
  selector: 'app-artist-links',
  templateUrl: './artist-links.component.html',
  styleUrls: ['./artist-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistLinksComponent {
  @Input() artist!: IArtistName[];
  @Input() platform!: IPlatformTypes;

}
