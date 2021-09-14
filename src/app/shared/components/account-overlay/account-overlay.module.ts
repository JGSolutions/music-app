import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/angular-material.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { AccountOverlayComponent } from './account-overlay.component';

@NgModule({
  declarations: [AccountOverlayComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    OverlayModule,
  ],
  exports: [
    AccountOverlayComponent
  ]
})
export class AccountOverlayModule { }
