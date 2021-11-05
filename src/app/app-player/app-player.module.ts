import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPlayerComponent } from './app-player.component';
import { CommonModule } from '@angular/common';
import { AppPlayerRoutingModule } from './app-player-routing.module';
import { MusicConnectedService } from '../services/music-connected.service';
import { ApiService } from '../services/api.service';
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
import { SpotifyPlayerFreeModule } from '../shared/components/spotify-player-free/spotify-player-free.module';
import { AccountOverlayModule } from '../shared/components/account-overlay/account-overlay.module';
import { PlatformSelectionModule } from '../shared/components/platform-selection/platform-selection.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    AppPlayerRoutingModule,
    PlayerbarModule,
    SoundcloudBarModule,
    SpotifyPlayerModule,
    SpotifyPlayerFreeModule,
    ReactiveFormsModule,
    AccountOverlayModule,
    PlatformSelectionModule,
    NgxsModule.forFeature([ConnectedServicesState, ArtistsState, SongsState, SearchState, HistoryState]),
  ],
  providers: [MusicConnectedService, ApiService, HowlerPlayerService, CurrentTrackService, HistoryService, PlaylistService],
})
export class AppPlayerModule { }
