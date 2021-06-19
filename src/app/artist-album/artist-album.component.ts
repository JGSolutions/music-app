import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ArtistAlbumSongs } from '../core/stores/artists/artists.actions';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { OpenPlayerAction } from '../core/stores/player/player.actions';
import { IArtists, IPlatformTypes } from 'models/artist.types';
import { IAlbumInfo, ISong } from 'models/song.types';

@Component({
  selector: 'app-artist-album',
  templateUrl: './artist-album.component.html',
  styleUrls: ['./artist-album.component.scss']
})
export class ArtistAlbumComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(ArtistsState.artistAlbum) artistAlbum$!: Observable<IAlbumInfo>;
  @Select(UserState.userState) user$!: Observable<IUserType>;

  public songDetailById$ = this.store.select(ArtistsState.songDetailById);
  public artist!: string;
  public profileDetails$!: Observable<IArtists>;
  public artistGenres$!: Observable<string[]>;
  public songs$!: Observable<ISong[]>;
  public id!: string;
  public platform!: string;

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.platform = this.route.snapshot.params.platform;
    this.id = this.route.snapshot.params.id;

    this.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => user !== null)
    ).subscribe((user) => {
      this.store.dispatch(new ArtistAlbumSongs(user.uid, this.platform as IPlatformTypes, this.id));
    });
    // const artistDetails$ = this.artistDetails$.pipe(
    //   map((artist) => artist(this.artist)),
    //   filter(data => !isUndefined(data)),
    //   shareReplay(1)
    // );

    /**
     * Details for artist profile
     */
    // this.profileDetails$ = artistDetails$.pipe(
    //   map((artists) => artists[0]),
    //   filter(data => !isUndefined(data)),
    //   shareReplay(1)
    // );

    // this.artistGenres$ = artistDetails$.pipe(
    //   map((details) => {
    //     return details.reduce((acc, value) => {
    //       if (value.genres) {
    //         acc = value.genres.map(genre => genre);
    //       }

    //       return acc;
    //     }, [] as string[]);
    //   })
    // )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedSong(evt: string): void {
    // this.songDetailById$.pipe(
    //   take(1),
    //   map((songDetail) => songDetail(evt))
    // ).subscribe((song) => {
    //   this.store.dispatch(new OpenPlayerAction({
    //     platform: song!.platform,
    //     name: song!.name,
    //     trackType: song!.trackType,
    //     artist: song?.artistName,
    //     externalUrl: song?.externalUrl,
    //     avatar: song?.pictures?.medium
    //   }));
    // });
  }
}
