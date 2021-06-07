import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [AudioPlayerComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    AudioPlayerComponent
  ]
})
export class AudioPlayerModule { }
