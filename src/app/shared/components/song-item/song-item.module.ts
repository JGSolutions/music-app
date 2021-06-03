import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongItemComponent } from './song-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { DateAgoPipe } from 'src/app/core/pipes/date-ago.pipe';
import { MinuteSecondsPipe } from 'src/app/core/pipes/minute-seconds.pipe';

@NgModule({
  declarations: [SongItemComponent, DateAgoPipe, MinuteSecondsPipe],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    SongItemComponent
  ]
})
export class SongItemModule { }
