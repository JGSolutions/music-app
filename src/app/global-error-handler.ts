import { Injectable, ErrorHandler } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private _snackBar: MatSnackBar) { }

  handleError(error: any) {
    let message = "";
    switch (error.status) {
      case 403:
        message = error.error.message
        break;
      default:
        message = "Error occured. Please try again!"
        break;
    }

    const snackRef = this._snackBar.open(message, 'Reload', {
      duration: 10000,
      horizontalPosition: 'left'
    });

    snackRef.onAction().subscribe(() => {
      window.location.reload();
    });

    throw 'error';
  }
}
