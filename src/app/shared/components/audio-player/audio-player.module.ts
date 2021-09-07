import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { MinuteSecondsModule } from 'src/app/core/pipes/minute-seconds.module';
import { RouterModule } from '@angular/router';
import { ArtistLinksModule } from '../artist-links/artist-links.module';

@NgModule({
  declarations: [AudioPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    MinuteSecondsModule,
    ArtistLinksModule
  ],
  exports: [
    AudioPlayerComponent
  ]
})
export class AudioPlayerModule { }
