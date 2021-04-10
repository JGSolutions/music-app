import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlatformSettingsComponent } from './platform-settings.component';
import { AngularMaterialModule } from 'src/angular-material.module';



@NgModule({
  declarations: [PlatformSettingsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild([
      { path: '', component: PlatformSettingsComponent },
    ]),
  ]
})
export class PlatformSettingsModule { }
