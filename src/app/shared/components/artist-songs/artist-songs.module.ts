import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistSongsComponent } from './artist-songs.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistAvatarModule } from '../artist-avatar/artist-avatar.module';
import { PlatformSelectionModule } from '../platform-selection/platform-selection.module';
import { SongItemModule } from '../song-item/song-item.module';
import { EmptyResultsModule } from '../empty-results/empty-results.module';

@NgModule({
  declarations: [ArtistSongsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArtistAvatarModule,
    PlatformSelectionModule,
    SongItemModule,
    EmptyResultsModule
  ],
  exports: [
    ArtistSongsComponent
  ]
})
export class ArtistSongsModule { }
