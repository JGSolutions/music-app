import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { IArtistName, IPlatformTypes } from 'models/artist.types';
import { IAvatar } from 'models/avatar.types';
import { IDurationType } from 'models/song.types';
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
  @Input() loading!: boolean;
  @Input() playSongLoading!: boolean;
  @Input() avatar!: IAvatar;
  @Input() name!: string;
  @Input() artist!: IArtistName[];
  @Input() currentTimer!: number;
  @Input() rawDuration!: number;
  @Input() durationType!: IDurationType;
  @Input() progress!: number;
  @Input() isPlaying!: boolean;
  @Input() disabled!: boolean;
  @Input() platform!: IPlatformTypes;

  @Output() sliderChange = new EventEmitter<number>();
  @Output() sliderInput = new EventEmitter<number>();
  @Output() play = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() addPlaylist = new EventEmitter<void>();

  public durationTypes = IDurationType;

  public playHandler(): void {
    this.play.emit();
  }

  public pauseHandler(): void {
    this.pause.emit();
  }

  public closeHandler(): void {
    this.close.emit();
  }

  public playlistHandler(): void {
    this.addPlaylist.emit();
  }

  /**
   * When user stops dragging then seek and continue playing
   * @param evt
   */
  public sliderChangeHandler(evt: any) {
    this.sliderChange.emit(evt.value);
  }

  /**
   * When user drags slider just pause the music file and update timer as user is dragging
   */
  public sliderInputHandler(evt: any): void {
    this.sliderInput.emit(evt.value);
  }

}
