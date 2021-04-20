import { Component, Input, OnInit } from '@angular/core';
import { IArtists } from 'functions/src/models/IArtists.types';


@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {
  @Input()
  artistName!: string;

  @Input()
  artistDetails!: IArtists[];
  constructor() { }

  ngOnInit(): void {
  }

}
