import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ITrackType } from 'functions/src/models/IArtists.types';
import { Pictures } from 'functions/src/models/IPictures.types';
import { Observable } from 'rxjs';
import { ICurrentTrack } from 'src/app/core/stores/player/player.types';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongItemComponent {
  @Input()
  name!: string;

  @Input()
  trackType!: ITrackType;

  @Input()
  externalUrl!: string;

  @Output() selectedSong = new EventEmitter<ICurrentTrack>();

  public avatar$!: Observable<Pictures>;
  public platforms$!: Observable<string[]>;

  public selectedItem(): void {
    this.selectedSong.emit({
      name: this.name,
      externalUrl: this.externalUrl,
      trackType: this.trackType,
    });

  }
}

