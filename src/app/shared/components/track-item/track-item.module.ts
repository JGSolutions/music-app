import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackItemComponent } from './track-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { MinuteSecondsModule } from 'src/app/core/pipes/minute-seconds.module';
import { EqualizerIconModule } from '../equalizer-icon/equalizer-icon.module';
import { TrackMatMenuModule } from '../track-mat-menu/track-mat-menu.module';

@NgModule({
  declarations: [TrackItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MinuteSecondsModule,
    EqualizerIconModule,
    TrackMatMenuModule
  ],
  exports: [
    TrackItemComponent
  ]
})
export class TrackItemModule { }
