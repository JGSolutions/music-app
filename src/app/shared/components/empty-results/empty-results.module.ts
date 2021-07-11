import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyResultsComponent } from './empty-results.component';

@NgModule({
  declarations: [EmptyResultsComponent],
  imports: [
    CommonModule
  ],
  exports: [
    EmptyResultsComponent
  ]
})
export class EmptyResultsModule { }
