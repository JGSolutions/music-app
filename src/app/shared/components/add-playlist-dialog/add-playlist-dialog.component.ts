import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: "app-add-playlist-dialog",
  templateUrl: "./add-playlist-dialog.component.html",
  styleUrls: ["./add-playlist-dialog.component.scss"],
})
export class AddPlaylistDialogComponent {
  public createForm: FormGroup;
  public playlistName = new FormControl("", [Validators.required]);

  constructor(
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPlaylistDialogComponent>
  ) {
    this.createForm = fb.group({
      playlistName: this.playlistName,
    });
  }

  public closeHandler(evt: any) {
    this.dialogRef.close();
  }

  public createPlayList() {
    if (this.createForm.invalid) {
      return;
    }

    console.log(this.createForm.value);
  }
}
