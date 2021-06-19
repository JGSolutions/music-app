import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumAvatarComponent } from './album-avatar.component';
import { MatDividerModule } from '@angular/material/divider';
import { AngularMaterialModule } from 'src/angular-material.module';
@NgModule({
  declarations: [AlbumAvatarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MatDividerModule
  ],
  exports: [
    AlbumAvatarComponent
  ]
})
export class AlbumAvatarModule { }
