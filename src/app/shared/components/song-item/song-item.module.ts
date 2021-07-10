import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongItemComponent } from './song-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { DateAgoPipe } from 'src/app/core/pipes/date-ago.pipe';
import { MinuteSecondsModule } from 'src/app/core/pipes/minute-seconds.module';
import { EqualizerIconModule } from '../equalizer-icon/equalizer-icon.module';

@NgModule({
  declarations: [SongItemComponent, DateAgoPipe],
  imports: [
    CommonModule,
    MinuteSecondsModule,
    AngularMaterialModule,
    EqualizerIconModule
  ],
  exports: [
    SongItemComponent
  ]
})
export class SongItemModule { }
