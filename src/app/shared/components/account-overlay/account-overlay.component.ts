import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LogoutAction } from 'src/app/core/stores/user/user.actions';
import { IUserType } from 'src/app/core/stores/user/user.types';

@Component({
  selector: 'app-account-overlay',
  templateUrl: './account-overlay.component.html',
  styleUrls: ['./account-overlay.component.scss']
})
export class AccountOverlayComponent {
  @Input()
  user$!: Observable<IUserType>;

  public overlayIsOpen = false;

  constructor(private store: Store, private router: Router) { }

  public backdropClicked(): void {
    this.overlayIsOpen = false;
  }

  public overlayDetached(): void {
    this.overlayIsOpen = false;
  }

  public clickHandler(): void {
    this.overlayIsOpen = true;
  }

  public signOut(): void {
    this.store.dispatch(new LogoutAction()).subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}

