import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistSongsComponent } from './artist-songs.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistSongsModule } from '../shared/components/artist-songs/artist-songs.module';

@NgModule({
  declarations: [ArtistSongsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArtistSongsModule,
    RouterModule.forChild([
      { path: '', component: ArtistSongsComponent },
    ]),
  ]
})
export class ArtistSongsViewModule { }
