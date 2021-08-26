import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { NgxsModule } from '@ngxs/store';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { ImageGridModule } from '../shared/components/image-grid/image-grid.module';
import { SongItemModule } from '../shared/components/song-item/song-item.module';
import { PlatformSelectionModule } from '../shared/components/platform-selection/platform-selection.module';
import { SearchState } from '../core/stores/search/search.state';
@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ImageGridModule,
    SongItemModule,
    PlatformSelectionModule,
    NgxsModule.forFeature([PlaylistState, SearchState]),
    RouterModule.forChild([
      { path: '', component: SearchComponent },
    ]),
  ]
})
export class SearchModule { }
