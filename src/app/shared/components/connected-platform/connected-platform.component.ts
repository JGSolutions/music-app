import { Component, Input } from '@angular/core';
import { IPlatformTypes } from 'models/artist.types';

@Component({
  selector: 'app-connected-platform',
  templateUrl: './connected-platform.component.html',
  styleUrls: ['./connected-platform.component.scss']
})
export class ConnectedPlatformComponent {
  @Input()
  platform!: IPlatformTypes;

}

