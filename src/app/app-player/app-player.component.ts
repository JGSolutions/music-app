import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ArtistsAction } from '../core/stores/artists/artists.actions';

@Component({
  selector: 'app-player',
  templateUrl: 'app-player.component.html',
  styleUrls: ['app-player.component.scss'],
})
export class AppPlayerComponent {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  public isMobile$: Observable<boolean>;

  private destroy$ = new Subject<boolean>();

  constructor(private breakpointObserver: BreakpointObserver, private store: Store) {
    this.isMobile$ = this.breakpointObserver.observe('(max-width: 599px)').pipe(
      map((result) => result.matches)
    );

    this.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => user !== null)
    ).subscribe((user) => {
      this.store.dispatch(new ArtistsAction(user.uid));
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
