import { Component, Input, OnInit } from '@angular/core';
import { IAvatar } from 'models/avatar.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {
  @Input()
  playlistName!: string;

  @Input()
  coverImages!: string[];

  public avatar$!: Observable<IAvatar>;
  public platforms$!: Observable<string[]>;

  ngOnInit(): void {

  }
}

