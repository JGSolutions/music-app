import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginWithGoogleAction } from '../core/stores/user/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // public sessionData: string;

  constructor(private store: Store) {

  }

  ngOnInit(): void {
    // this.sessionData = sessionStorage.getItem('logging');

    // if (this.sessionData === 'true') {
      // this.dialogRef = this.dialog.open(ProcessDialogComponent, {
      //   height: '120px',
      //   data: {
      //     message: 'Please wait!'
      //   }
      // });
    // }
  }

  login() {
    sessionStorage.setItem('logging', 'true');
    this.store.dispatch(new LoginWithGoogleAction());
  }
}
