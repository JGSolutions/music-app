import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MixcloudCallbackComponent } from './mixcloud-callback.component';
import { AngularMaterialModule } from 'src/angular-material.module';



@NgModule({
  declarations: [MixcloudCallbackComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild([
      { path: '', component: MixcloudCallbackComponent },
    ]),
  ]
})
export class MixcloudCallbackModule { }
