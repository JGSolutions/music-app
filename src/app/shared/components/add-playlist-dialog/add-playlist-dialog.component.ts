import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: "app-add-playlist-dialog",
  templateUrl: "./add-playlist-dialog.component.html",
  styleUrls: ["./add-playlist-dialog.component.scss"],
})
export class AddPlaylistDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPlaylistDialogComponent>
  ) { }

  public closeHandler(evt: any) {
    this.dialogRef.close();
  }
}
