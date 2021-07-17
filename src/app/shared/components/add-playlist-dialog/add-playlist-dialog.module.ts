import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AddPlaylistDialogComponent } from './add-playlist-dialog.component';

@NgModule({
  declarations: [AddPlaylistDialogComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    AddPlaylistDialogComponent
  ]
})
export class AddPlaylistModule { }
