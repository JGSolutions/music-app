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
import { PlayerState } from '../core/stores/player/player.state';
import { PlayerbarModule } from '../shared/components/player-bar/player-bar.module';
import { HowlerPlayerService } from '../shared/components/player-bar/howl-player.service';
import { CurrentTrackService } from '../services/current-track.service';

@NgModule({
  declarations: [AppPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    AppPlayerRoutingModule,
    PlayerbarModule,
    NgxsModule.forFeature([ConnectedServicesState, ArtistsState, PlayerState]),
  ],
  providers: [MusicConnectedService, ApiService, HowlerPlayerService, CurrentTrackService],
})
export class AppPlayerModule { }
