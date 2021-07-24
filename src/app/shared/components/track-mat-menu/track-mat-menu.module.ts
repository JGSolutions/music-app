import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/angular-material.module';
import { TrackMatMenuComponent } from './track-mat-menu.component';

@NgModule({
  declarations: [TrackMatMenuComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    TrackMatMenuComponent
  ]
})
export class TrackMatMenuModule { }
