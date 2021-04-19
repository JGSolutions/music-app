import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistItemComponent } from './artist-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [ArtistItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    ArtistItemComponent
  ]
})
export class ArtistItemModule { }
