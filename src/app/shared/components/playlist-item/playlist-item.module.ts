import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistItemComponent } from './playlist-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [PlaylistItemComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    PlaylistItemComponent
  ]
})
export class PlaylistItemModule { }
