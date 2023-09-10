import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  signOut,
  authState,
} from '@angular/fire/auth';

import { TrainingService } from './../training/training.service';
import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //event emitters
  authChange = new Subject<boolean>();

  //private properties
  private isAuthenticated = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  //public methods
  initAuthListener() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(
      this.auth!,
      authData.email,
      authData.password
    )
      .then(() => this.uiService.loadingStateChanged.next(false))
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(error.message, undefined, 3000);
      });
  }

  loging(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    signInWithEmailAndPassword(this.auth!, authData.email, authData.password)
      .then(() => this.uiService.loadingStateChanged.next(false))
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(error.message, undefined, 3000);
      });
  }

  logout() {
    signOut(this.auth!).catch((err) => console.error(err));
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
