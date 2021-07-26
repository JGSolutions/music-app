import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistComponent } from './playlist.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [PlaylistComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild([
      { path: '', component: PlaylistComponent },
    ]),
  ]
})
export class PlaylistModule { }
