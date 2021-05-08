import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformSelectionComponent } from './platform-selection.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [PlatformSelectionComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    PlatformSelectionComponent
  ]
})
export class PlatformSelectionModule { }
