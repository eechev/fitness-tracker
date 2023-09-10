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
    private trainingService: TrainingService
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
    createUserWithEmailAndPassword(
      this.auth!,
      authData.email,
      authData.password
    ).catch((error) => console.error(error));
  }

  loging(authData: AuthData) {
    signInWithEmailAndPassword(
      this.auth!,
      authData.email,
      authData.password
    ).catch((error) => console.error(error));
  }

  logout() {
    signOut(this.auth!).catch((err) => console.error(err));
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
