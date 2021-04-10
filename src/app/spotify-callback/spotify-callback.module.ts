import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpotifyCallbackComponent } from './spotify-callback.component';


@NgModule({
  declarations: [SpotifyCallbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SpotifyCallbackComponent },
    ]),
  ]
})
export class SpotifyCallbackModule { }
