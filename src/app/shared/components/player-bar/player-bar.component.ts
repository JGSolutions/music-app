import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isUndefined as _isUndefined, isEmpty as _isEmpty } from "lodash";
import { Howl } from 'howler';
@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent implements OnInit {
  @Input() streamUrl$!: Observable<any | null>;
  @Input() isLoading!: boolean;

  ngOnInit() {
    this.streamUrl$.pipe(
      filter((streamUrl) => !_isEmpty(streamUrl)),
      map((streamUrl) => streamUrl.url)
    ).subscribe((url) => {
      const sound = new Howl({
        src: [url],
        html5: true,
        preload: true,
        volume: 1,
      });

      sound.play();
    });
  }
}
