import { Component, ChangeDetectionStrategy, OnDestroy, EventEmitter, Output, AfterContentInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { isEmpty as _isEmpty } from "lodash";
import { Select, Store } from '@ngxs/store';
import { ICurrentTrack, ISoundcloudStreamUrls } from 'src/app/core/stores/songs/songs.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { SongsState } from 'src/app/core/stores/songs/songs.state';
import { LoadingPlayerAction, SetCurrentTrackPlayStatusAction, SoundcloudAudioFileAction } from 'src/app/core/stores/songs/songs.actions';
import { HowlerPlayerService } from 'src/app/services/howl-player.service';
import { IPlatformTypes } from 'models/artist.types';

@Component({
  selector: 'app-soundcloud-bar',
  templateUrl: './soundcloud-bar.component.html',
  styleUrls: ['./soundcloud-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundcloudBarComponent implements AfterContentInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SongsState.loading) loading$!: Observable<boolean>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  @Select(SongsState.soundcloudStreamUrls) soundcloudStreamUrls$!: Observable<ISoundcloudStreamUrls>;
  @Select(SongsState.currentTrackLoading) currentTrackLoading$!: Observable<boolean>;

  @Output() trackReady = new EventEmitter<any>();
  @Output() close = new EventEmitter<string>();
  @Output() addPlaylist = new EventEmitter<ICurrentTrack>();

  public playSongLoading$ = new Subject<boolean>();

  private destroy$ = new Subject<void>();

  constructor(public howlService: HowlerPlayerService, private store: Store) { }

  ngAfterContentInit() {
    this.currentTrack$.pipe(
      filter((currentTrack) => currentTrack?.platform === IPlatformTypes.soundcloud),
      distinctUntilChanged((prev, curr) => prev.audioFile === curr.audioFile),
      tap((currentTrack) => this.trackReady.emit(currentTrack)),
      withLatestFrom(this.user$),
      switchMap(([currentTrack, user]) => this.store.dispatch(new SoundcloudAudioFileAction(user.uid!, currentTrack.audioFile!))),
      takeUntil(this.destroy$),
    ).subscribe();

    this.soundcloudStreamUrls$.pipe(
      takeUntil(this.destroy$),
      filter(e => !_isEmpty(e))
    ).subscribe(streamUrls => {
      this.playSongLoading$.next(true);
      this.howlService.initHowler(streamUrls.http_mp3_128_url!);
    });

    this.howlService.$onload.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new SetCurrentTrackPlayStatusAction(false));
      this.store.dispatch(new LoadingPlayerAction(false));
    });

    this.howlService.$isPlaying.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.playSongLoading$.next(false);
      this.store.dispatch(new SetCurrentTrackPlayStatusAction(value));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();

    this.stop();
  }

  public closeHandler(): void {
    this.currentTrack$.pipe(
      take(1)
    ).subscribe((currentTrack) => {
      this.close.emit(currentTrack.id);
    });
  }

  public playlistHandler(): void {
    this.currentTrack$.pipe(
      take(1)
    ).subscribe((currentTrack) => {
      this.addPlaylist.emit(currentTrack);
    });
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
