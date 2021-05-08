import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongItemComponent } from './song-item.component';
import { AngularMaterialModule } from 'src/angular-material.module';

@NgModule({
  declarations: [SongItemComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    SongItemComponent
  ]
})
export class SongItemModule { }
