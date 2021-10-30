import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistItemComponent } from './playlist-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [PlaylistItemComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [
    PlaylistItemComponent
  ]
})
export class PlaylistItemModule { }
