import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'models/artist.types';
import { ISearchResults } from 'models/search.model';
import { ISongTrackType } from 'models/song.types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { SearchTypeAction } from '../core/stores/search/search.actions';
import { SearchState } from '../core/stores/search/search.state';
import { SetCurrentSelectedSongAction } from '../core/stores/songs/songs.actions';
import { SongsState } from '../core/stores/songs/songs.state';
import { ICurrentTrack, ISongCommonState } from '../core/stores/songs/songs.types';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SearchState.searchResults) searchResults$!: Observable<ISearchResults>;
  @Select(SearchState.searchType) searchType$!: Observable<number>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  private destroy$ = new Subject<boolean>();

  public songDetailById$ = this.store.select(SearchState.songDetailById);

  constructor(private router: Router, private store: Store) { }

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
    ).subscribe((data: ISongCommonState | undefined) => {
      console.log(data);
      if (data?.trackType !== ISongTrackType.track) {
        this.router.navigate(['artist-album', data?.platform, data?.id]);
      } else {
        this.store.dispatch(new SetCurrentSelectedSongAction(data.id!, "songs"));
      }
    });
  }
}
