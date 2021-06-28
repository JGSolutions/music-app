import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerBarComponent } from './player-bar.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AudioPlayerModule } from '../audio-player/audio-player.module';
import { NgxsModule } from '@ngxs/store';
import { HistoryState } from 'src/app/core/stores/history/history.state';

@NgModule({
  declarations: [PlayerBarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AudioPlayerModule,
    NgxsModule.forFeature([HistoryState]),
  ],
  exports: [
    PlayerBarComponent
  ]
})
export class PlayerbarModule { }
