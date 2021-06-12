import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistAvatarComponent } from './artist-avatar.component';
import { MatDividerModule } from '@angular/material/divider';
import { AngularMaterialModule } from 'src/angular-material.module';
@NgModule({
  declarations: [ArtistAvatarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    ArtistAvatarComponent
  ]
})
export class ArtistAvatarModule { }
