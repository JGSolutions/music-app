import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent implements OnChanges {
  @Input() streamUrl!: string;
  @Input() isLoading!: boolean;

  @ViewChild('audio') nameAudio!: ElementRef<HTMLAudioElement>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isLoading && changes.isLoading.currentValue) {
      this.nameAudio.nativeElement.pause();
    }

    const containStreamUrl = changes.streamUrl && changes.streamUrl.currentValue;

    if (changes.isLoading && !changes.isLoading.currentValue && containStreamUrl) {
      this.nameAudio.nativeElement.load();
      this.streamUrl = changes.streamUrl.currentValue;
    }
  }
}
