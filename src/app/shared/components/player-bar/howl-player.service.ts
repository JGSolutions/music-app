import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';
import { ReplaySubject, Subject } from 'rxjs';
import { formatTime } from 'src/app/core/utils/utils';

@Injectable()
export class HowlerPlayerService {
  public howler = Howler;
  public $onload: ReplaySubject<void>;
  public $sliderProgress: ReplaySubject<number>;
  public $currentTimer: ReplaySubject<string>;
  public $duration: ReplaySubject<string>;
  public $rawDuration: ReplaySubject<number>;

  private _sound!: Howl;
  private _raf = 0;

  constructor() {
    this.$onload = new ReplaySubject(1);
    this.$sliderProgress = new ReplaySubject(1);
    this.$currentTimer = new ReplaySubject(1);
    this.$duration = new ReplaySubject(1);
    this.$rawDuration = new ReplaySubject(1);
  }

  public initHowler(streamUrl: string): void {
    if (this._sound) {
      cancelAnimationFrame(this._raf);
      this._sound.unload();
    }

    this._sound = new Howl({
      src: [streamUrl],
      html5: true,
      autoplay: false,
      preload: 'metadata',
      volume: 1,
      onload: () => {
        const formattedDurationTime = formatTime(Math.round(this._sound?.duration()!));
        this.$duration.next(formattedDurationTime);
        this.$currentTimer.next("0:00");
        this.$rawDuration.next(this._sound?.duration()!);
        this.$onload.next();
      },
      onplay: () => {
        this._raf = requestAnimationFrame(this.step.bind(this));
      }
    })
  }

  public duration(): number {
    if (this._sound) {
      return this._sound.duration();
    }

    return 0;
  }

  public play(): void {
    if (this._sound) {
      this._sound.play();
    }
  }

  public pause(): void {
    if (this._sound) {
      if (this._sound?.playing()) {
        cancelAnimationFrame(this._raf);
      }
      this._sound.pause();
    }
  }

  public stop(): void {
    if (this._sound) {
      this._sound.stop();
    }
  }

  public isPlaying(): boolean {
    if (this._sound) {
      return this._sound.playing();
    }

    return false;
  }

  private step() {
    const seek = this._sound?.seek() || 0 as number;
    const timer = formatTime(Math.round(seek as number));

    this.$currentTimer.next(timer);
    this.$sliderProgress.next(seek as number);

    this._raf = requestAnimationFrame(this.step.bind(this));
  }

  public seek(per: number): void {
    this._sound?.seek(per);
  }
}
