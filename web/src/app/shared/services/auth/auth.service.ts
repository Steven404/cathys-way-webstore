import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { defer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(Auth);

  constructor(private router: Router) {
    this.firebaseAuth.onAuthStateChanged((v) => {
      // console.log(v);
      // if (v) {
      //   console.log(v.email);
      // }
    });
  }

  async waitForState() {
    await this.firebaseAuth.authStateReady();
  }

  getUser() {
    return this.firebaseAuth.currentUser;
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return defer(() =>
      signInWithEmailAndPassword(this.firebaseAuth, email, password),
    );
  }

  signOut() {
    this.firebaseAuth.signOut().then(() => {
      this.router.navigate(['']);
    });
  }
}
