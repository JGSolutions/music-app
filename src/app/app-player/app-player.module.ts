import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPlayerComponent } from './app-player.component';
import { CommonModule } from '@angular/common';
import { AppPlayerRoutingModule } from './app-player-routing.module';
import { MusicConnectedService } from '../services/music-connected.services';
import { ApiService } from '../services/api.service';

@NgModule({
  declarations: [AppPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppPlayerRoutingModule,
  ],
  providers: [MusicConnectedService, ApiService],
})
export class AppPlayerModule {}
