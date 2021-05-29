import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { isEmpty as _isEmpty } from "lodash";
import { HowlerPlayerService } from './howl-player.service';
import { Store } from '@ngxs/store';
import { LoadingPlayerAction } from 'src/app/core/stores/player/player.actions';
import { ICurrentTrack } from 'src/app/core/stores/player/player.types';
import { MatSliderChange } from '@angular/material/slider';
@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  @Input() streamUrl$!: Observable<any | null>;
  @Input() loading$!: Observable<boolean>;
  @Input() currentTrack!: ICurrentTrack;

  public isPlaying$ = new BehaviorSubject(false);

  private destroy$ = new Subject<boolean>();

  constructor(public howlService: HowlerPlayerService, private store: Store) { }

  ngOnInit() {
    this.streamUrl$.pipe(
      takeUntil(this.destroy$),
      filter((streamUrl) => !_isEmpty(streamUrl)),
      map((streamUrl) => streamUrl.url)
    ).subscribe((url) => {
      this.howlService.initHowler(url);
    });

    this.howlService.$onload.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isPlaying$.next(true);
      this.store.dispatch(new LoadingPlayerAction(false));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public play(): void {
    this.isPlaying$.next(true);
    this.howlService.play();
  }

  public pause(): void {
    this.isPlaying$.next(false);
    this.howlService.pause();
  }

  public stop(): void {
    this.howlService.stop();
  }

  private _formatTime(secs: number): string {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  public sliderChange(evt: any) {
    // console.log(evt.value);
    // this.howlService.seek(evt.value);

    // this.howlService.play();
    // this.isPlaying$.next(true);
  }
  public sliderInput(evt: any) {
    // const newTime: number = this.howlService.duration() * (evt.value / 100);
    // this.currentTime = this._formatTime(newTime);
    this.howlService.seek(evt.value)
  }
}
