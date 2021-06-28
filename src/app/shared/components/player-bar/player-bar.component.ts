import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { isEmpty as _isEmpty } from "lodash";
import { HowlerPlayerService } from './howl-player.service';
import { Select, Store } from '@ngxs/store';
import { LoadingPlayerAction, AudioFileAction } from 'src/app/core/stores/player/player.actions';
import { ICurrentTrack } from 'src/app/core/stores/artists/artists-state.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { PlayerState } from 'src/app/core/stores/player/player.state';
import { IStreamUrl } from 'src/app/core/stores/player/player.types';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(PlayerState.mixcloudAudio) mixcloudAudio$!: Observable<IStreamUrl>;

  @Input() loading$!: Observable<boolean>;
  @Input() currentTrack$!: Observable<ICurrentTrack>;

  private destroy$ = new Subject<boolean>();

  constructor(public howlService: HowlerPlayerService, private store: Store) { }

  ngOnInit() {
    this.currentTrack$.pipe(
      takeUntil(this.destroy$),
      filter((streamUrl) => !_isEmpty(streamUrl)),
      distinctUntilChanged((prev, curr) => prev.externalUrl === curr.externalUrl),
      map((streamUrl) => streamUrl.externalUrl),
      withLatestFrom(this.user$),
      switchMap(([url, user]) => this.store.dispatch(new AudioFileAction(user.uid, url)))
    ).subscribe();

    this.mixcloudAudio$.pipe(
      takeUntil(this.destroy$),
      filter((streamUrl) => !_isEmpty(streamUrl))
    ).subscribe((audioFile) => {
      this.howlService.initHowler(audioFile.url)
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
