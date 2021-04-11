import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import firebase from 'firebase/app';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IUserType, UserStateModel } from './user.types';
import { LoginWithGoogleAction, LogoutAction, SetUserAction } from './user.actions';
import { ConnectedServicesAction } from '../connected-services/connected-services.actions';

@State<UserStateModel>({
  name: 'user',
  defaults: {
      user: null,
      loaded: false,
  },
})
@Injectable()
export class UserState {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private store: Store,
    private afs: AngularFirestore,
    private router: Router) {
  }

  @Selector()
  static userState(state: UserStateModel) {
    return state.user;
  }

  @Action(LoginWithGoogleAction)
  async _loginWithGoogle(ctx: StateContext<UserStateModel>) {
    const provider = new firebase.auth.GoogleAuthProvider();

    await this.angularFireAuth.signInWithRedirect(provider);

  }

  @Action(LogoutAction)
  async logout(ctx: StateContext<UserStateModel>) {
    await this.angularFireAuth.signOut();
  }

  @Action(SetUserAction)
  setUser(ctx: StateContext<UserStateModel>, action: SetUserAction) {
    ctx.patchState({
      user: action.user,
      loaded: true,
    });
  }

  ngxsOnInit(ctx: StateContext<UserStateModel>) {
    this.angularFireAuth.getRedirectResult().then((result) => {
      if (result.credential) {
        setTimeout(() => this.updateUserAccount(result), 100);
        sessionStorage.clear();
        this.router.navigate(['/', 'platform-settings']);
      }
    });

    this.angularFireAuth.user.pipe(
      switchMap(user => {
        if (user) {
          this.store.dispatch(new ConnectedServicesAction(user.uid));
          return this.afs.doc<IUserType>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    ).subscribe((user: any) => {
      ctx.dispatch(new SetUserAction(this.getUserFromFirebase(user)));
    });
  }

  private getUserFromFirebase(user: IUserType): IUserType | null {
    if (user) {
      return {
        uid: user.uid || '',
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
      };
    } else {
      return null;
    }
  }

  private updateUserAccount(credential: any) {
    const userRef: AngularFirestoreDocument<IUserType> = this.afs.doc(`users/${credential.user.uid}`);

    return userRef.set({
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL,
    }, { merge: true });
  }
}
