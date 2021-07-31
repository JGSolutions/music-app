import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistItemComponent } from './playlist-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [PlaylistItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    PlaylistItemComponent
  ]
})
export class PlaylistItemModule { }
