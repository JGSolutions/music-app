import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistLinksComponent } from './artist-links.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ArtistLinksComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    ArtistLinksComponent
  ]
})
export class ArtistLinksModule { }
