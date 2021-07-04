import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyPlayerComponent } from './spotify-player.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AudioPlayerModule } from '../audio-player/audio-player.module';

@NgModule({
  declarations: [SpotifyPlayerComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AudioPlayerModule,
  ],
  exports: [
    SpotifyPlayerComponent
  ]
})
export class SpotifyPlayerModule { }
