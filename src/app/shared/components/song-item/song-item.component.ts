import { Component, Input, OnInit } from '@angular/core';
import { Pictures } from 'functions/src/models/IPictures.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss']
})
export class SongItemComponent implements OnInit {
  @Input()
  name!: string;

  public avatar$!: Observable<Pictures>;
  public platforms$!: Observable<string[]>;

  ngOnInit(): void {

  }
}
