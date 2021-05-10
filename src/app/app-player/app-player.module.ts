import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPlayerComponent } from './app-player.component';
import { CommonModule } from '@angular/common';
import { AppPlayerRoutingModule } from './app-player-routing.module';
import { MusicConnectedService } from '../services/music-connected.services';
import { ApiService } from '../services/api.service';
import { AngularMaterialModule } from 'src/angular-material.module';
import { NgxsModule } from '@ngxs/store';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { PlayerState } from '../core/stores/player/player.state';

@NgModule({
  declarations: [AppPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    AppPlayerRoutingModule,
    NgxsModule.forFeature([ConnectedServicesState, ArtistsState, PlayerState]),
  ],
  providers: [MusicConnectedService, ApiService],
})
export class AppPlayerModule { }
