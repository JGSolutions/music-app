import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistAlbumComponent } from './artist-album.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AlbumAvatarModule } from '../shared/components/album-avatar/album-avatar.module';
import { TrackItemModule } from '../shared/components/track-item/track-item.module';
@NgModule({
  declarations: [ArtistAlbumComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AlbumAvatarModule,
    TrackItemModule,
    RouterModule.forChild([
      { path: '', component: ArtistAlbumComponent },
    ]),
  ]
})
export class ArtistAlbumModule { }
