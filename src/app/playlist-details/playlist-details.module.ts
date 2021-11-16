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
import { MinuteSecondsModule } from '../core/pipes/minute-seconds.module';
import { JoinListPipe } from '../core/pipes/join-list.pipe';
import { EmptyResultsModule } from '../shared/components/empty-results/empty-results.module';
import { AlertModule } from '../shared/components/alert/alert.module';
@NgModule({
  declarations: [PlaylistDetailsComponent, JoinListPipe],
  imports: [
    CommonModule,
    SongItemModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MinuteSecondsModule,
    EmptyResultsModule,
    AlertModule,
    NgxsModule.forFeature([PlaylistState]),
    RouterModule.forChild([
      { path: '', component: PlaylistDetailsComponent },
    ]),
  ]
})
export class PlaylistDetailsModule { }
