import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistProfileComponent } from './artist-profile.component';
import { AngularMaterialModule } from 'src/angular-material.module';



@NgModule({
  declarations: [ArtistProfileComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild([
      { path: '', component: ArtistProfileComponent },
    ]),
  ]
})
export class ArtistProfileModule { }
