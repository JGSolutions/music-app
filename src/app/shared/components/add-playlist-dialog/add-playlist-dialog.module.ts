import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AddPlaylistDialogComponent } from './add-playlist-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddPlaylistDialogComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    AddPlaylistDialogComponent
  ]
})
export class AddPlaylistModule { }
