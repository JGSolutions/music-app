import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistSongsViewComponent } from './artist-songs.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistSongsModule } from '../shared/components/artist-songs/artist-songs.module';

@NgModule({
  declarations: [ArtistSongsViewComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArtistSongsModule,
    RouterModule.forChild([
      { path: '', component: ArtistSongsViewComponent },
    ]),
  ]
})
export class ArtistSongsViewModule { }
