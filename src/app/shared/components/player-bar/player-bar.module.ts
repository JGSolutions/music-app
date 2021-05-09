import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerBarComponent } from './player-bar.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [PlayerBarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    PlayerBarComponent
  ]
})
export class PlayerbarModule { }
