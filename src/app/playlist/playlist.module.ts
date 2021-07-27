import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistComponent } from './playlist.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { NgxsModule } from '@ngxs/store';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { PlaylistItemModule } from '../shared/components/playlist-item/playlist-item.module';

@NgModule({
  declarations: [PlaylistComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PlaylistItemModule,
    NgxsModule.forFeature([PlaylistState]),
    RouterModule.forChild([
      { path: '', component: PlaylistComponent },
    ]),
  ]
})
export class PlaylistModule { }
