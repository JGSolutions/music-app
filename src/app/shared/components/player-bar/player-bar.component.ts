import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { isEmpty as _isEmpty } from "lodash";
import { HowlerPlayerService } from './howl-player.service';
import { Select, Store } from '@ngxs/store';
import { LoadingPlayerAction } from 'src/app/core/stores/player/player.actions';
import { ICurrentTrack } from 'src/app/core/stores/artists/artists-state.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { AudioFileAction } from 'src/app/core/stores/artists/artists.actions';
import { ArtistsState } from 'src/app/core/stores/artists/artists.state';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ArtistsState.audioFile) audioFile$!: Observable<string>;

  @Input() loading$!: Observable<boolean>;
  @Input() currentTrack$!: Observable<ICurrentTrack>;

  @Output() trackReady = new EventEmitter<any>();

  private destroy$ = new Subject<boolean>();

  constructor(public howlService: HowlerPlayerService, private store: Store) { }

  ngOnInit() {
    this.currentTrack$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => prev.externalUrl === curr.externalUrl),
      filter((streamUrl) => _isEmpty(streamUrl.audioFile)),
      map((streamUrl) => streamUrl.externalUrl),
      withLatestFrom(this.user$),
      switchMap(([url, user]) => this.store.dispatch(new AudioFileAction(user.uid, url))),
    ).subscribe();

    this.audioFile$.pipe(
      takeUntil(this.destroy$),
      filter((audioFile) => !_isEmpty(audioFile)),
      withLatestFrom(this.currentTrack$),
    ).subscribe(([audioFile, currentTrack]) => {
      this.howlService.initHowler(audioFile);
      this.trackReady.emit(currentTrack);
    });

    this.howlService.$onload.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new LoadingPlayerAction(false));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.stop();
  }

  public play(): void {
    this.howlService.play();
  }

  public pause(): void {
    this.howlService.pause();
  }

  public stop(): void {
    this.howlService.stop();
  }

  /**
   * When user stops dragging then seek and continue playing
   * @param evt
   */
  public sliderChange(evt: number) {
    this.howlService.seek(evt);
    this.howlService.play();
  }

  /**
   * When user drags slider just pause the music file and update timer as user is dragging
   */
  public sliderInput(evt: number): void {
    this.howlService.$currentTimer.next(evt)
    this.howlService.pause();
  }

}
