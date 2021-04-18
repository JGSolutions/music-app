import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import {BreakpointObserver} from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: 'app-player.component.html',
  styleUrls: ['app-player.component.scss'],
})
export class AppPlayerComponent implements OnInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  public isMobile$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver.observe('(max-width: 599px)').pipe(
      map((result) => result.matches)
    );
  }

  ngOnInit() {

  }

}
