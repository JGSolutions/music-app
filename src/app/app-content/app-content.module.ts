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
  providers: [MusicConnectedService, ApiService],
})
export class AppContentModule { }
