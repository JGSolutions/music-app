import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { MinuteSecondsModule } from 'src/app/core/pipes/minute-seconds.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AudioPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    MinuteSecondsModule
  ],
  exports: [
    AudioPlayerComponent
  ]
})
export class AudioPlayerModule { }
