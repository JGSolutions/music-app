import { Component, Input, OnInit } from '@angular/core';
import { IAvatar } from 'models/avatar.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artist-avatar',
  templateUrl: './artist-avatar.component.html',
  styleUrls: ['./artist-avatar.component.scss']
})
export class ArtistAvatarComponent implements OnInit {
  @Input()
  artistName!: string;

  @Input()
  avatar!: string;

  @Input()
  genres!: string[];

  ngOnInit(): void {

  }
}

