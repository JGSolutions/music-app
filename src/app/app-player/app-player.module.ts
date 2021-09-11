import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPlayerComponent } from './app-player.component';
import { CommonModule } from '@angular/common';
import { AppPlayerRoutingModule } from './app-player-routing.module';
import { MusicConnectedService } from '../services/music-connected.service';
import { ApiService } from '../services/api.service';
import { AngularMaterialModule } from 'src/angular-material.module';
import { NgxsModule } from '@ngxs/store';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { PlayerbarModule } from '../shared/components/player-bar/player-bar.module';
import { CurrentTrackService } from '../services/current-track.service';
import { HistoryService } from '../services/history.service';
import { SpotifyPlayerModule } from '../shared/components/spotify-player/spotify-player.module';
import { PlaylistService } from '../services/playlist.service';
import { SongsState } from '../core/stores/songs/songs.state';
import { SearchState } from '../core/stores/search/search.state';
import { ReactiveFormsModule } from '@angular/forms';
import { SoundcloudBarModule } from '../shared/components/soundcloud-bar/soundcloud-bar.module';
import { HowlerPlayerService } from '../services/howl-player.service';
import { HistoryState } from '../core/stores/history/history.state';

@NgModule({
  declarations: [AppPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    AppPlayerRoutingModule,
    PlayerbarModule,
    SoundcloudBarModule,
    SpotifyPlayerModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([ConnectedServicesState, ArtistsState, SongsState, SearchState, HistoryState]),
  ],
  providers: [MusicConnectedService, ApiService, HowlerPlayerService, CurrentTrackService, HistoryService, PlaylistService],
})
export class AppPlayerModule { }
