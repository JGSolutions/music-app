import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistAlbumComponent } from './artist-album.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AlbumAvatarModule } from '../shared/components/album-avatar/album-avatar.module';
import { TrackItemModule } from '../shared/components/track-item/track-item.module';
import { AddPlaylistModule } from '../shared/components/add-playlist-dialog/add-playlist-dialog.module';
@NgModule({
  declarations: [ArtistAlbumComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AlbumAvatarModule,
    TrackItemModule,
    AddPlaylistModule,
    RouterModule.forChild([
      { path: '', component: ArtistAlbumComponent },
    ]),
  ]
})
export class ArtistAlbumModule { }
