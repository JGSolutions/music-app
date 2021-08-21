import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistSongsComponent } from './artist-songs.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistAvatarModule } from '../artist-avatar/artist-avatar.module';

@NgModule({
  declarations: [ArtistSongsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArtistAvatarModule
  ],
  exports: [
    ArtistSongsComponent
  ]
})
export class ArtistSongsModule { }
