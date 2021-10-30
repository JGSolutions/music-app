import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  @Input()
  coverImages!: string;
}

