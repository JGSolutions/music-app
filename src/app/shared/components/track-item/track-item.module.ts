import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackItemComponent } from './track-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [TrackItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    TrackItemComponent
  ]
})
export class TrackItemModule { }
