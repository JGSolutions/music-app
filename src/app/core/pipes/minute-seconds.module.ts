import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinuteSecondsPipe } from './minute-seconds.pipe';


@NgModule({
  declarations: [MinuteSecondsPipe],
  exports: [MinuteSecondsPipe],
  imports: [
    CommonModule
  ]
})
export class MinuteSecondsModule { }
