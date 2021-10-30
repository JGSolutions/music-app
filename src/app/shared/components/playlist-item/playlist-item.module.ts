import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistItemComponent } from './playlist-item.component';
import { ImageGridModule } from '../image-grid/image-grid.module';

@NgModule({
  declarations: [PlaylistItemComponent],
  imports: [
    CommonModule,
    ImageGridModule
  ],
  exports: [
    PlaylistItemComponent
  ]
})
export class PlaylistItemModule { }
