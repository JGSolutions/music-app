import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  },
  {
    path: 'platform-settings',
    loadChildren: () => import('./platform-settings/platform-settings.module').then( m => m.PlatformSettingsModule)
  },
  {
    path: 'mixcloud-callback',
    loadChildren: () => import('./mixcloud-callback/mixcloud-callback.module').then( m => m.MixcloudCallbackModule)
  },
  {
    path: 'spotify-callback',
    loadChildren: () => import('./spotify-callback/spotify-callback.module').then( m => m.SpotifyCallbackModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
