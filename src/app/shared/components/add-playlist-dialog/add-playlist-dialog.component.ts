import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Select, Store } from '@ngxs/store';
import { IPlayLists } from 'models/playlist.types';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AddToPlaylistAction, PlaylistDataAction, PlaylistTrackDataAction } from 'src/app/core/stores/playlist/playlist.actions';
import { PlaylistState } from 'src/app/core/stores/playlist/playlist.state';
import { ISelectedPlaylist } from 'src/app/core/stores/playlist/playlist.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
@Component({
  selector: "app-add-playlist-dialog",
  templateUrl: "./add-playlist-dialog.component.html",
  styleUrls: ["./add-playlist-dialog.component.scss"],
})
export class AddPlaylistDialogComponent implements OnInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(PlaylistState.playlist) playlist$!: Observable<IPlayLists[]>;
  @Select(PlaylistState.playlistTrackIds) playlistTrackIds$!: Observable<string[]>;

  public createForm: FormGroup;
  public playlistName = new FormControl("", [Validators.required]);

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    fb: FormBuilder,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: ISelectedPlaylist,
    public dialogRef: MatDialogRef<AddPlaylistDialogComponent>
  ) {
    this.createForm = fb.group({
      playlistName: this.playlistName,
    });
  }

  ngOnInit() {
    this.user$.pipe(
      takeUntil(this.dialogRef.afterClosed())
    ).subscribe((user) => {
      this.store.dispatch([
        new PlaylistDataAction(user.uid!),
        new PlaylistTrackDataAction(user.uid!, this.data.id!)
      ]);
    });
  }

  public selectionChange(event: any): void {
    this.user$.pipe(take(1)).subscribe(user => {
      if (event.options[0].selected) {
        this.store.dispatch(new AddToPlaylistAction(
          this.data,
          event.options[0].value,
          user.uid!
        ));
      }
    })
  }

  public createPlayList() {
    if (this.createForm.invalid) {
      return;
    }

    this.user$.pipe(
      take(1)
    ).subscribe(user => {
      this.createForm.controls['playlistName'].reset();
      this.accordion.closeAll();
    })
  }
}
