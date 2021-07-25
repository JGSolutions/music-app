import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: "app-track-mat-menu",
  templateUrl: "./track-mat-menu.component.html",
  styleUrls: ["./track-mat-menu.component.scss"],
})
export class TrackMatMenuComponent {
  @Input()
  isAlbum!: boolean;

  @Output() addToPlaylist = new EventEmitter<void>();
  @Output() addFavorite = new EventEmitter<void>();
  @Output() listenLater = new EventEmitter<void>();


  public addFavoriteHandler() {
    this.addFavorite.emit();
  }

  public listenLaterHandler() {
    this.listenLater.emit();
  }

  public addToPlaylistHandler() {
    this.addToPlaylist.emit();
  }
}
