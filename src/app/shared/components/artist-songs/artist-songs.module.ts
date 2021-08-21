import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistSongsComponent } from './artist-songs.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [ArtistSongsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    ArtistSongsComponent
  ]
})
export class AudioPlayerModule { }
