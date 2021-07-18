import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreatePlaylistAction } from 'src/app/core/stores/playlist/playlist.actions';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';

@Component({
  selector: "app-add-playlist-dialog",
  templateUrl: "./add-playlist-dialog.component.html",
  styleUrls: ["./add-playlist-dialog.component.scss"],
})
export class AddPlaylistDialogComponent {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  public createForm: FormGroup;
  public playlistName = new FormControl("", [Validators.required]);

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    fb: FormBuilder,
    private store: Store,
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

    this.user$.pipe(
      take(1)
    ).subscribe(user => {
      this.store.dispatch(new CreatePlaylistAction({
        playlistName: this.createForm.value.playlistName,
        uid: user.uid!,
        createdDate: new Date()
      }));

      this.accordion.closeAll();
    })
  }
}
