import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IArtistName, IPlatformTypes } from 'models/artist.types';
import { IAvatar } from 'models/avatar.types';
import { IDurationType, ISongTrackType } from 'models/song.types';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongItemComponent {
  @Input()
  isPlaying!: boolean;

  @Input()
  artists!: IArtistName[];

  @Input()
  currentTrackId!: string;

  @Input()
  name!: string;

  @Input()
  albumId!: string;

  @Input()
  id!: string;

  @Input()
  avatar!: string;

  @Input()
  length!: number;

  @Input()
  durationType!: IDurationType;

  @Input()
  totalTracks!: number;

  @Input()
  dateCreated!: any;

  @Input()
  trackType!: ISongTrackType;

  @Input()
  platform!: IPlatformTypes;

  @Input()
  externalUrl!: string;

  @Input()
  removeOptionItem = false;

  @Output() selectedSong = new EventEmitter<string>();
  @Output() addToPlaylistEvent = new EventEmitter<string>();
  @Output() removeToPlaylistEvent = new EventEmitter<string>();

  public avatar$!: Observable<IAvatar>;
  public platforms$!: Observable<string[]>;
  public trackTypes = ISongTrackType;

  public selectedItem(): void {
    this.selectedSong.emit(this.id);
  }

  public addToFavorites(): void {

  }

  public addToPlaylist(): void {
    this.addToPlaylistEvent.emit(this.id);
  }

  public removePlaylist(): void {
    this.removeToPlaylistEvent.emit(this.id);
  }
}

