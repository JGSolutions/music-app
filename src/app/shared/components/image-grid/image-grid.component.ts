import { Component, Input } from '@angular/core';
import { ICoverImages } from 'src/app/core/stores/playlist/playlist.types';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent {
  @Input()
  coverImages!: string;
}

