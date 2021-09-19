import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { AppPlayerComponent } from './app-player.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: AppPlayerComponent,
    children: [
      {
        path: 'artists',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin, connectedServices: true },
        loadChildren: () => import('../artists/artists.module').then(m => m.ArtistsModule)
      },
      {
        path: 'artist/:artist',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin, connectedServices: 'false' },
        loadChildren: () => import('../artist-profile/artist-profile.module').then(m => m.ArtistProfileModule)
      },
      {
        path: 'artist-songs',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../artist-songs/artist-songs.module').then(m => m.ArtistSongsViewModule)
      },
      {
        path: 'artist-album/:platform/:id',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../artist-album/artist-album.module').then(m => m.ArtistAlbumModule)
      },
      {
        path: 'playlist',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin, connectedServices: false },
        loadChildren: () => import('../playlist/playlist.module').then(m => m.PlaylistModule)
      },
      {
        path: 'search',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'playlist/:playlistid',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../playlist-details/playlist-details.module').then(m => m.PlaylistDetailsModule)
      },
      {
        path: 'platform-settings',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../platform-settings/platform-settings.module').then(m => m.PlatformSettingsModule)
      },
      {
        path: 'mixcloud-callback',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../mixcloud-callback/mixcloud-callback.module').then(m => m.MixcloudCallbackModule)
      },
      {
        path: 'spotify-callback',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../spotify-callback/spotify-callback.module').then(m => m.SpotifyCallbackModule)
      },
      {
        path: 'soundcloud-callback',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../soundcloud-callback/soundcloud-callback.module').then(m => m.SoundcloudCallbackModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppPlayerRoutingModule { }
