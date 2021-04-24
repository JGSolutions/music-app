import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
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
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../artists/artists.module').then(m => m.ArtistsModule)
      },

      {
        path: 'artist/:artist',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../artist-profile/artist-profile.module').then(m => m.ArtistProfileModule)
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
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppPlayerRoutingModule { }
