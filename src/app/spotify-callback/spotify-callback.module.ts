import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpotifyCallbackComponent } from './spotify-callback.component';
import { AngularMaterialModule } from 'src/angular-material.module';


@NgModule({
  declarations: [SpotifyCallbackComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild([
      { path: '', component: SpotifyCallbackComponent },
    ]),
  ]
})
export class SpotifyCallbackModule { }
