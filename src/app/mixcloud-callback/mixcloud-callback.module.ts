import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MixcloudCallbackComponent } from './mixcloud-callback.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ConnectedPlatformModule } from '../shared/components/connected-platform/connected-platform.module';

@NgModule({
  declarations: [MixcloudCallbackComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ConnectedPlatformModule,
    RouterModule.forChild([
      { path: '', component: MixcloudCallbackComponent },
    ]),
  ]
})
export class MixcloudCallbackModule { }
