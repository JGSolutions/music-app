import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGridComponent } from './image-grid.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [ImageGridComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    ImageGridComponent
  ]
})
export class ImageGridModule { }
