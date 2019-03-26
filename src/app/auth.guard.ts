
import {tap, map, take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';





import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './services/auth.service';



@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService._authFB.authState.pipe(
      take(1),
      map(authState => !! authState),
      tap( authenticated => {
        if (!authenticated) {
          this.router.navigate(['/ilogin']);
      }

    }), );
  }
}
