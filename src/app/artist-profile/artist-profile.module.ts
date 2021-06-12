import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistProfileComponent } from './artist-profile.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { PlatformSelectionModule } from '../shared/components/platform-selection/platform-selection.module';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
import { ArtistAvatarModule } from '../shared/components/artist-avatar/artist-avatar.module';

@NgModule({
  declarations: [ArtistProfileComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PlatformSelectionModule,
    SongItemModule,
    ArtistAvatarModule,
    RouterModule.forChild([
      { path: '', component: ArtistProfileComponent },
    ]),
  ]
})
export class ArtistProfileModule { }
