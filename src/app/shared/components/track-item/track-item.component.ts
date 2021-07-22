import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlatformTypes } from 'models/artist.types';
import { IAvatar } from 'models/avatar.types';
import { IDurationType, ISongTrackType } from 'models/song.types';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackItemComponent {
  @Input()
  name!: string;

  @Input()
  isPlaying!: boolean;

  @Input()
  currentTrackId!: string;

  @Input()
  index!: number;

  @Input()
  id!: string;

  @Input()
  avatar!: string;

  @Input()
  length!: number;

  @Input()
  durationType!: IDurationType;

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

