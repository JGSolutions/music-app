import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistsComponent } from './artists.component';

@NgModule({
  declarations: [ArtistsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ArtistsComponent },
    ]),
  ]
})
export class ArtistsModule { }
