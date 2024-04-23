import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { SnackbarComponent } from 'src/app/pages/admin/shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message: any): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
