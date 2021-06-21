import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackItemComponent } from './track-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { MinuteSecondsModule } from 'src/app/core/pipes/minute-seconds.module';

@NgModule({
  declarations: [TrackItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MinuteSecondsModule
  ],
  exports: [
    TrackItemComponent
  ]
})
export class TrackItemModule { }
