import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Pictures } from 'functions/src/models/IPictures.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongItemComponent implements OnInit {
  @Input()
  name!: string;

  @Input()
  trackType!: string;

  public avatar$!: Observable<Pictures>;
  public platforms$!: Observable<string[]>;

  ngOnInit() {

  }

  public openUrl(trackType: string) {
    if (trackType === "track" || trackType === "single") {
      // open player bar
    } else {
      // open album page
    }
  }
}

