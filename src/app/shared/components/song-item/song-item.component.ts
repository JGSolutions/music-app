import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlatformTypes } from 'functions/sdk/IPlatforms.types';
import { ITrackType } from 'functions/src/models/IArtists.types';
import { Pictures } from 'functions/src/models/IPictures.types';
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
  trackType!: ITrackType;

  @Input()
  platform!: IPlatformTypes;

  @Input()
  externalUrl!: string;

  @Output() selectedSong = new EventEmitter<string>();

  public avatar$!: Observable<Pictures>;
  public platforms$!: Observable<string[]>;
  public trackTypes = ITrackType;

  public selectedItem(): void {
    this.selectedSong.emit(this.id);
  }
}

