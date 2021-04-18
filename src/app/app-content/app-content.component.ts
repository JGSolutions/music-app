import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { LogoutAction } from '../core/stores/user/user.actions';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
// import { PwaService } from '../shared/services/pwa.service';

@Component({
  selector: 'app-content',
  templateUrl: 'app-content.component.html',
  styleUrls: ['app-content.component.scss'],
})
export class AppContentComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;

  private destroy$ = new Subject<boolean>();
  constructor(private store: Store, private router: Router) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  public signOut() {
    this.store.dispatch(new LogoutAction()).subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
