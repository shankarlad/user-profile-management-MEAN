import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { eLocalSrorage } from '../../sharedenums';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  private accessToken = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
    private socialAuthService: SocialAuthService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    if (localStorage.getItem(eLocalSrorage.Token)) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.socialAuthService.authState.subscribe((user) => {
      const loginDetails = { email: user.email };
      this.authService.loginWithGoogle(loginDetails).subscribe((user) => {
        this.loginUtility(user);
      });
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe((data) => {
        this.loginUtility(data);
      });
    }
  }

  getAccessToken(): void {
    this.socialAuthService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => (this.accessToken = accessToken));
  }

  getGoogleCalendarData(): void {
    if (!this.accessToken) return;

    this.httpClient
      .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      .subscribe((events) => {
        alert('Look at your console');
        console.log('events', events);
      });
  }

  loginUtility(data: IUser) {
    this.toastrService.success('Your Successfully Logged In');
    this.authService.userName.next(data.name);
    this.authService.isLoggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }
}
