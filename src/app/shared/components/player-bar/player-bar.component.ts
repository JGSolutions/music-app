import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isUndefined as _isUndefined, isEmpty as _isEmpty } from "lodash";
import { HowlerPlayerService } from './howl-player.service';
@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent implements OnInit {
  @Input() streamUrl$!: Observable<any | null>;
  @Input() isLoading!: boolean;

  constructor(private howlService: HowlerPlayerService) { }

  ngOnInit() {
    this.streamUrl$.pipe(
      filter((streamUrl) => !_isEmpty(streamUrl)),
      map((streamUrl) => streamUrl.url)
    ).subscribe((url) => {
      this.howlService.initHowler(url);
    });

    this.howlService.$onload.subscribe(() => {
      console.log("WOW LOADED");
    });
  }

  public play() {
    this.howlService.play();
  }

  public pause() {
    this.howlService.pause();
  }

  public stop() {
    this.howlService.stop();
  }
}
