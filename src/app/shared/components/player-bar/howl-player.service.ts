import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';
import { Subject } from 'rxjs';

@Injectable()
export class HowlerPlayerService {
  public howler = Howler;
  public $onload: Subject<void>;

  private _sound: Howl | undefined;

  constructor() {
    this.$onload = new Subject();
  }

  public initHowler(streamUrl: string): void {
    if (this._sound) {
      this._sound.unload();
    }
    this._sound = new Howl({
      src: [streamUrl],
      html5: true,
      autoplay: true,
      preload: true,
      volume: 1,
      onload: () => {
        this.$onload.next();
      },
    })
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
}
