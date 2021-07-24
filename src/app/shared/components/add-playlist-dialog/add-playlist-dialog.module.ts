import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/angular-material.module';
import { AddPlaylistDialogComponent } from './add-playlist-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { PlaylistState } from 'src/app/core/stores/playlist/playlist.state';

@NgModule({
  declarations: [AddPlaylistDialogComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([PlaylistState])
  ],
  exports: [
    AddPlaylistDialogComponent
  ]
})
export class AddPlaylistModule { }
