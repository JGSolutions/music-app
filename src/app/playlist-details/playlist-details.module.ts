import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistDetailsComponent } from './playlist-details.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { NgxsModule } from '@ngxs/store';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { ImageGridModule } from '../shared/components/image-grid/image-grid.module';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
@NgModule({
  declarations: [PlaylistDetailsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ImageGridModule,
    SongItemModule,
    NgxsModule.forFeature([PlaylistState]),
    RouterModule.forChild([
      { path: '', component: PlaylistDetailsComponent },
    ]),
  ]
})
export class PlaylistDetailsModule { }
