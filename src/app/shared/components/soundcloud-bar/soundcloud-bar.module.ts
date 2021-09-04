import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundcloudBarComponent } from './soundcloud-bar.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AudioPlayerModule } from '../audio-player/audio-player.module';

@NgModule({
  declarations: [SoundcloudBarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AudioPlayerModule
  ],
  exports: [
    SoundcloudBarComponent
  ]
})
export class SoundcloudBarModule { }
