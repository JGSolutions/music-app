import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlatformTypes } from 'models/artist.types';
import { IAvatar } from 'models/avatar.types';
import { ISongTrackType } from 'models/song.types';
import { Observable } from 'rxjs';

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
  id!: string;

  @Input()
  avatar!: string;

  @Input()
  length!: number;

  @Input()
  dateCreated!: any;

  @Input()
  trackType!: ISongTrackType;

  @Input()
  platform!: IPlatformTypes;

  @Input()
  externalUrl!: string;

  @Output() selectedSong = new EventEmitter<string>();

  public avatar$!: Observable<IAvatar>;
  public platforms$!: Observable<string[]>;
  public trackTypes = ISongTrackType;

  public selectedItem(): void {
    this.selectedSong.emit(this.id);
  }
}

