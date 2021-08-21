import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { IDurationType } from 'models/song.types';
@Component({
  selector: 'app-artist-songs',
  templateUrl: './artist-songs.component.html',
  styleUrls: ['./artist-songs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistSongsComponent {
  @Input() loading!: boolean;
  @Input() playSongLoading!: boolean;

  @Output() sliderChange = new EventEmitter<number>();


  public durationTypes = IDurationType;




  /**
   * When user stops dragging then seek and continue playing
   * @param evt
   */
  public sliderChangeHandler(evt: any) {
    this.sliderChange.emit(evt.value);
  }

}
