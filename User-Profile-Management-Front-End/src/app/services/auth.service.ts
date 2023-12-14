import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, tap } from 'rxjs';
import { eLocalSrorage } from '../sharedenums';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  userName = new Subject<string>();

  authUrl = 'http://localhost:3000/api/auth/login-user';
  googleLoginUrl = 'http://localhost:3000/api/auth/login-with-google';

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  loginUser = (loginDetails: {}): Observable<any> => {
    return this.http.post(this.authUrl, loginDetails).pipe(
      tap((res: any) => {
        localStorage.setItem(eLocalSrorage.UserDetails, JSON.stringify(res));
        localStorage.setItem(eLocalSrorage.Token, res.jwtToken);
      }),
      catchError((error: any): any => {
        this.toastrService.error(error.error.message);
      })
    );
  };

  loginWithGoogle = (loginDetails: { email: string }): Observable<any> => {
    return this.http.post(this.googleLoginUrl, loginDetails).pipe(
      tap((res: any) => {
        localStorage.setItem(eLocalSrorage.UserDetails, JSON.stringify(res));
        localStorage.setItem(eLocalSrorage.Token, res.jwtToken);
      }),
      catchError((error: any): any => {
        this.toastrService.error(error.error.message);
      })
    );
  };
}
