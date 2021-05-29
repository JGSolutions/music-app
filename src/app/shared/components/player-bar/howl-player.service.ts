import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class HowlerPlayerService {
  public howler = Howler;
  public $onload: ReplaySubject<void>;
  public $percentageProgress: ReplaySubject<number>;
  public $timer: ReplaySubject<string>;
  public $duration: ReplaySubject<string>;
  public $rawDuration: ReplaySubject<number>;

  private _sound: Howl | undefined;

  constructor() {
    this.$onload = new ReplaySubject();
    this.$percentageProgress = new ReplaySubject();
    this.$timer = new ReplaySubject();
    this.$duration = new ReplaySubject();
    this.$rawDuration = new ReplaySubject();
  }

  public initHowler(streamUrl: string): void {
    if (this._sound) {
      this._sound.unload();
    }
    this._sound = new Howl({
      src: [streamUrl],
      html5: true,
      autoplay: true,
      preload: 'metadata',
      volume: 1,
      onload: () => {
        this.$onload.next();
      },
      onplay: () => {
        const formattedDurationTime = this.formatTime(Math.round(this._sound?.duration()!));
        this.$duration.next(formattedDurationTime);
        this.$rawDuration.next(this._sound?.duration()!);
        requestAnimationFrame(this.step.bind(this));
      },
      onseek: () => {
        requestAnimationFrame(this.step.bind(this));
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

  public formatTime(secs: number): string {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  private step() {
    const seek = this._sound?.seek() || 0 as number;
    const timer = this.formatTime(Math.round(seek as number));
    const percentageProgress = (((seek as number / this._sound?.duration()!) * 100) || 0);

    this.$timer.next(timer);
    this.$percentageProgress.next(seek as number);

    requestAnimationFrame(this.step.bind(this));
  }

  public seek(per: number) {
    this._sound?.seek(per);
  }
}
