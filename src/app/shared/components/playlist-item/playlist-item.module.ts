import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistItemComponent } from './playlist-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ImageGridModule } from '../image-grid/image-grid.module';

@NgModule({
  declarations: [PlaylistItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ImageGridModule
  ],
  exports: [
    PlaylistItemComponent
  ]
})
export class PlaylistItemModule { }
