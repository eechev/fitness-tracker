import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class UIService {
  //event emitter
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, action: any, duration: number) {
    this.snackBar.open(message, action, { duration: duration });
  }
}
