import { Component, EventEmitter, OnInit, Output } from '@angular/core';
@Component({
  selector: "app-track-mat-menu",
  templateUrl: "./track-mat-menu.component.html",
  styleUrls: ["./track-mat-menu.component.scss"],
})
export class TrackMatMenuComponent implements OnInit {

  @Output() addToPlaylist = new EventEmitter<void>();
  constructor() {

  }

  ngOnInit() {

  }

  public addToPlaylistHandler() {
    this.addToPlaylist.emit();
  }
}
