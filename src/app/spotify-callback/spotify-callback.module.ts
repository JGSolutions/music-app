import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpotifyCallbackComponent } from './spotify-callback.component';
import { ConnectedPlatformModule } from '../shared/components/connected-platform/connected-platform.module';


@NgModule({
  declarations: [SpotifyCallbackComponent],
  imports: [
    CommonModule,
    ConnectedPlatformModule,
    RouterModule.forChild([
      { path: '', component: SpotifyCallbackComponent },
    ]),
  ]
})
export class SpotifyCallbackModule { }
