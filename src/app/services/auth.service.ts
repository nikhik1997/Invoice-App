
import {from as observableFrom, Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { Router } from '@angular/router';


import * as firebase from 'firebase';

@Injectable()
export class AuthService {

  
  public user: Observable<firebase.User>;
  

  constructor(public _authFB: AngularFireAuth, private _router: Router, private _ngZone: NgZone, ) {
    this.user = this._authFB.authState;    
  }

  registerWithEmail(auth_details) {

    this._authFB.auth.createUserWithEmailAndPassword(auth_details.email, auth_details.password)
      .then((data) => {        
        this._router.navigate(['/login']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  login(email, password): Observable<any> {
    return observableFrom(
      this._authFB.auth.signInWithEmailAndPassword(email, password)
    );
  }  

  isAuthenticated(): Observable<boolean> {
    return this.user.pipe(map(user => user && user.uid !== undefined));
  }

  getAuth() {    
      return this._authFB.authState.pipe(map((user) => {
          return user.uid;
      }));  
  }

  logout() {
    this._authFB.auth.signOut()
      .then(() => {
        this._router.navigate(['/ilogin']);
      });
  }

  loginWithGoogle() {
    this._ngZone.runOutsideAngular(() => {
      this._authFB.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((data) => {
          console.log(data);          
          this._router.navigate(['/home']);
        });
    });
  }

}

