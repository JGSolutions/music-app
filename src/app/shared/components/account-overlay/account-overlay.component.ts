import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
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

  public backdropClicked(): void {
    this.overlayIsOpen = false;
  }

  public overlayDetached(): void {
    this.overlayIsOpen = false;
  }

  public clickHandler(): void {
    this.overlayIsOpen = true;
  }
}

