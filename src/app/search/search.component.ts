import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'models/artist.types';
import { ISearchResults } from 'models/search.model';
import { ISong, ISongTrackType } from 'models/song.types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { filter, take } from 'rxjs/operators';
import { SearchTypeAction } from '../core/stores/search/search.actions';
import { SearchState } from '../core/stores/search/search.state';
import { SetCurrentSongAction } from '../core/stores/songs/songs.actions';
import { SongsState } from '../core/stores/songs/songs.state';
import { ICurrentTrack, ISongCommonState } from '../core/stores/songs/songs.types';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { isEmpty as _isEmpty, isUndefined as _isUndefined } from "lodash";
import { AddPlaylistDialogComponent } from '../shared/components/add-playlist-dialog/add-playlist-dialog.component';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SearchState.searchResults) searchResults$!: Observable<ISearchResults>;
  @Select(SearchState.searchType) searchType$!: Observable<number>;

  public songDetailById$ = this.store.select(SearchState.songDetailById);
  public currentTrack$ = this.store.select(SongsState.currentTrack).pipe(
    distinctUntilChanged((prev, next) => prev?.id === next?.id && prev?.isPlaying === next?.isPlaying),
    shareReplay(1)
  );

  private destroy$ = new Subject<boolean>();

  constructor(private router: Router, private store: Store, private dialog: MatDialog) { }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedTabChange(evt: any) {
    this.store.dispatch(new SearchTypeAction(evt));
  }

  public selectArtist(item: IArtists): void {
    this.router.navigate(["/", "artist-songs"], {
      queryParams: {
        platform: item.platform,
        id: item.id,
        username: item.username
      }
    });
  }

  public selectedSong(selectedSong: string): void {
    combineLatest([this.songDetailById$, this.currentTrack$]).pipe(
      take(1),
      filter(([songDetailById, currentTrack]) => currentTrack?.id !== selectedSong),
      map(([songDetailById]) => songDetailById(selectedSong))
    ).subscribe((data: ISong | undefined) => {
      if (data?.trackType !== ISongTrackType.track) {
        this.router.navigate(['artist-album', data?.platform, data?.id]);
      } else {
        const currentTrack: ICurrentTrack = {
          platform: data!.platform,
          name: data!.name,
          trackType: data!.trackType,
          artist: data?.artist || [],
          externalUrl: data?.externalUrl || "",
          avatar: data?.pictures,
          duration: data?.duration,
          durationType: data?.durationType,
          audioFile: data?.streamUrl || "",
          isPlaying: false,
          id: data?.id!,
          albumid: data?.albumid || ""
        };

        this.store.dispatch(new SetCurrentSongAction(currentTrack));
      }
    });
  }

  public addToPlayList(selectedSong: string): void {
    this.songDetailById$.pipe(
      take(1),
      map(fn => fn(selectedSong))
    ).subscribe((data: (ISongCommonState | undefined)) => {
      if (data?.trackType !== ISongTrackType.track) {
        this.router.navigate(['artist-album', data?.platform, data?.id]);
      } else {
        const song: ISongCommonState = {
          id: data?.id,
          artist: data?.artist,
          name: data?.name!,
          platform: data?.platform!,
          playlists: [],
          duration: data?.duration,
          durationType: data?.durationType!,
          trackType: data?.trackType!,
          pictures: data?.pictures!,
          externalUrl: data?.externalUrl,
          createdTime: data?.createdTime || ''
        };

        this.dialog.open(AddPlaylistDialogComponent, {
          maxWidth: '350px',
          panelClass: 'playlist-dialog',
          hasBackdrop: true,
          data: song
        });
      }
    });
  }

  public identify(index: number, item: ISong): string {
    return item.id;
  }
}
