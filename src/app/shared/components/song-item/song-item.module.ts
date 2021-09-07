import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongItemComponent } from './song-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { DateAgoPipe } from 'src/app/core/pipes/date-ago.pipe';
import { MinuteSecondsModule } from 'src/app/core/pipes/minute-seconds.module';
import { EqualizerIconModule } from '../equalizer-icon/equalizer-icon.module';
import { TrackMatMenuModule } from '../track-mat-menu/track-mat-menu.module';
import { ArtistLinksModule } from '../artist-links/artist-links.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SongItemComponent, DateAgoPipe],
  imports: [
    CommonModule,
    MinuteSecondsModule,
    AngularMaterialModule,
    RouterModule,
    EqualizerIconModule,
    ArtistLinksModule,
    TrackMatMenuModule
  ],
  exports: [
    SongItemComponent
  ]
})
export class SongItemModule { }
