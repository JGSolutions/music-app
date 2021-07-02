import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerBarComponent } from './player-bar.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AudioPlayerModule } from '../audio-player/audio-player.module';

@NgModule({
  declarations: [PlayerBarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AudioPlayerModule
  ],
  exports: [
    PlayerBarComponent
  ]
})
export class PlayerbarModule { }
