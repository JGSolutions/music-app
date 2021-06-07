import { Component, Input, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent implements OnInit {
  @Input() loading!: boolean;
  @Input() avatar!: string;
  @Input() name!: string;
  @Input() artist!: string;
  @Input() currentTimer!: string;
  @Input() duration!: string;
  @Input() rawDuration!: number;
  @Input() progress!: number;
  @Input() isPlaying!: boolean;

  @Output() sliderChange = new EventEmitter<number>();
  @Output() sliderInput = new EventEmitter<number>();

  ngOnInit() {

  }

  public play(): void {

  }

  public pause(): void {

  }

  public stop(): void {

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
