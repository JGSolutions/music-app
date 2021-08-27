import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SoundCloudCallbackComponent } from './soundcloud-callback.component';
import { ConnectedPlatformModule } from '../shared/components/connected-platform/connected-platform.module';

@NgModule({
  declarations: [SoundCloudCallbackComponent],
  imports: [
    CommonModule,
    ConnectedPlatformModule,
    RouterModule.forChild([
      { path: '', component: SoundCloudCallbackComponent },
    ]),
  ]
})
export class SoundcloudCallbackModule { }
