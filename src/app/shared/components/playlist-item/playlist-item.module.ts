import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistItemComponent } from './playlist-item.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [PlaylistItemComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    PlaylistItemComponent
  ]
})
export class PlaylistItemModule { }
