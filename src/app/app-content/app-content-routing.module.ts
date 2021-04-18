import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AppContentComponent } from './app-content.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: AppContentComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then( m => m.LoginModule)
      },
      {
        path: 'platform-settings',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../platform-settings/platform-settings.module').then( m => m.PlatformSettingsModule)
      },
      {
        path: 'mixcloud-callback',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../mixcloud-callback/mixcloud-callback.module').then( m => m.MixcloudCallbackModule)
      },
      {
        path: 'spotify-callback',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('../spotify-callback/spotify-callback.module').then( m => m.SpotifyCallbackModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppContentRoutingModule { }
