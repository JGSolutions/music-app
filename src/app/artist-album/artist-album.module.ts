import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistAlbumComponent } from './artist-album.component';
import { AngularMaterialModule } from 'src/angular-material.module';
// import { PlatformSelectionModule } from '../shared/components/platform-selection/platform-selection.module';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
import { ArtistAvatarModule } from '../shared/components/artist-avatar/artist-avatar.module';

@NgModule({
  declarations: [ArtistAlbumComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    SongItemModule,
    ArtistAvatarModule,
    RouterModule.forChild([
      { path: '', component: ArtistAlbumComponent },
    ]),
  ]
})
export class ArtistAlbumModule { }
