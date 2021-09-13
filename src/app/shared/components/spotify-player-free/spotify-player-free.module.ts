import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyPlayerFreeComponent } from './spotify-player-free.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistLinksModule } from '../artist-links/artist-links.module';

@NgModule({
  declarations: [SpotifyPlayerFreeComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArtistLinksModule
  ],
  exports: [
    SpotifyPlayerFreeComponent
  ]
})
export class SpotifyPlayerFreeModule { }
