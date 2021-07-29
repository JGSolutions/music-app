import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppContentComponent } from './app-content.component';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { AppContentRoutingModule } from './app-content-routing.module';
import { environment } from 'src/environments/environment';
import { MusicConnectedService } from '../services/music-connected.service';
import { ApiService } from '../services/api.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { UserState } from '../core/stores/user/user.state';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
@NgModule({
  declarations: [AppContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppContentRoutingModule,
    NgxsModule.forRoot([UserState], {
      developmentMode: !environment.production
    }),
  ],
  providers: [MusicConnectedService, ApiService,
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 8080] : undefined },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined }
  ],
})
export class AppContentModule { }
