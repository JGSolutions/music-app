import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistAlbumComponent } from './artist-album.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
import { AlbumAvatarModule } from '../shared/components/album-avatar/album-avatar.module';
@NgModule({
  declarations: [ArtistAlbumComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AlbumAvatarModule,
    SongItemModule,
    RouterModule.forChild([
      { path: '', component: ArtistAlbumComponent },
    ]),
  ]
})
export class ArtistAlbumModule { }
