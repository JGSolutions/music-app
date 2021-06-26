import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MixcloudCallbackComponent } from './mixcloud-callback.component';
import { ConnectedPlatformModule } from '../shared/components/connected-platform/connected-platform.module';

@NgModule({
  declarations: [MixcloudCallbackComponent],
  imports: [
    CommonModule,
    ConnectedPlatformModule,
    RouterModule.forChild([
      { path: '', component: MixcloudCallbackComponent },
    ]),
  ]
})
export class MixcloudCallbackModule { }
