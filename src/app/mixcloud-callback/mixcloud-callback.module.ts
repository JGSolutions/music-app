import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MixcloudCallbackComponent } from './mixcloud-callback.component';



@NgModule({
  declarations: [MixcloudCallbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MixcloudCallbackComponent },
    ]),
  ]
})
export class MixcloudCallbackModule { }
