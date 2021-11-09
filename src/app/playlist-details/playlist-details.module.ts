import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistDetailsComponent } from './playlist-details.component';
import { NgxsModule } from '@ngxs/store';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [PlaylistDetailsComponent],
  imports: [
    CommonModule,
    SongItemModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    NgxsModule.forFeature([PlaylistState]),
    RouterModule.forChild([
      { path: '', component: PlaylistDetailsComponent },
    ]),
  ]
})
export class PlaylistDetailsModule { }
