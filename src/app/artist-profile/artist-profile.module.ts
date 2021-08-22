import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistProfileComponent } from './artist-profile.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistSongsModule } from '../shared/components/artist-songs/artist-songs.module';

@NgModule({
  declarations: [ArtistProfileComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArtistSongsModule,
    RouterModule.forChild([
      { path: '', component: ArtistProfileComponent },
    ]),
  ]
})
export class ArtistProfileModule { }
