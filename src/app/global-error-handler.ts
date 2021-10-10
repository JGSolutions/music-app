import { Injectable, ErrorHandler } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private _snackBar: MatSnackBar) { }

  handleError(error: any) {
    const snackRef = this._snackBar.open("Error occured! Please try again!", 'Reload', {
      duration: 10000,
      horizontalPosition: 'left'
    });

    snackRef.onAction().subscribe(() => {
      window.location.reload();
    });

    throw 'error';
  }
}
