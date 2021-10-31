import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistDetailsComponent } from './playlist-details.component';
import { NgxsModule } from '@ngxs/store';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
@NgModule({
  declarations: [PlaylistDetailsComponent],
  imports: [
    CommonModule,
    SongItemModule,
    NgxsModule.forFeature([PlaylistState]),
    RouterModule.forChild([
      { path: '', component: PlaylistDetailsComponent },
    ]),
  ]
})
export class PlaylistDetailsModule { }
