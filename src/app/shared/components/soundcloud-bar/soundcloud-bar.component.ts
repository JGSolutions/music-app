import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { isEmpty as _isEmpty } from "lodash";
import { Select, Store } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/songs/songs.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { SongsState } from 'src/app/core/stores/songs/songs.state';
import { LoadingPlayerAction, SetCurrentTrackPlayStatusAction, SoundcloudAudioFileAction } from 'src/app/core/stores/songs/songs.actions';
import { HowlerPlayerService } from 'src/app/services/howl-player.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-soundcloud-bar',
  templateUrl: './soundcloud-bar.component.html',
  styleUrls: ['./soundcloud-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundcloudBarComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SongsState.loading) loading$!: Observable<boolean>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  @Select(SongsState.currentTrackLoading) currentTrackLoading$!: Observable<boolean>;

  @Output() trackReady = new EventEmitter<any>();

  public playSongLoading$ = new Subject<boolean>();

  private destroy$ = new Subject<boolean>();

  constructor(public apiService: ApiService, public howlService: HowlerPlayerService, private store: Store) { }

  ngOnInit() {
    this.currentTrack$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => prev.audioFile === curr.audioFile),
      tap((currentTrack) => this.trackReady.emit(currentTrack)),
      withLatestFrom(this.user$),
      switchMap(([currentTrack, user]) => {
        this.store.dispatch(new SoundcloudAudioFileAction(user.uid!, currentTrack.audioFile!));
        return this.apiService.soundcloudAudioStream(user.uid!, currentTrack.audioFile!);
      })
    ).subscribe((streamUrls) => {
      this.playSongLoading$.next(true);
      this.howlService.initHowler(streamUrls.http_mp3_128_url!);
      // this.store.dispatch(new LoadingPlayerAction(true));
    });

    this.howlService.$onload.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch([
        new SetCurrentTrackPlayStatusAction(false),
        new LoadingPlayerAction(false)
      ]);
    });

    this.howlService.$isPlaying.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.playSongLoading$.next(false);
      this.store.dispatch(new SetCurrentTrackPlayStatusAction(true));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.stop();
  }

  public play(): void {
    this.playSongLoading$.next(true);
    this.howlService.play();
  }

  public pause(): void {
    this.howlService.pause();
    this.store.dispatch(new SetCurrentTrackPlayStatusAction(false));
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
