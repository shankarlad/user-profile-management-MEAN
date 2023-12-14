import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { eLocalSrorage } from '../../sharedenums';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  userName: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private socialAuthService: SocialAuthService,

  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((value) => (this.isLoggedIn = value));
    this.authService.userName.subscribe((name) => (this.userName = name));

    let userDetails: string | null =
      localStorage.getItem(eLocalSrorage.UserDetails) || null;
    if (userDetails) {
      const UD: {
        userId: string;
        name: string;
        role: string;
        jwtToken: string;
      } = JSON.parse(userDetails);
      this.userName = UD.name;
    }

    if (localStorage.getItem(eLocalSrorage.Token)) {
      this.isLoggedIn = true;
      this.authService.userName.subscribe((name) => (this.userName = name));
    }
  }

  logOut() {
    this.authService.isLoggedIn.next(false);
    this.toastrService.warning('Logout Succeddfully');
    localStorage.removeItem(eLocalSrorage.UserDetails);
    localStorage.removeItem(eLocalSrorage.Token);
    this.router.navigate(['/login']);
    this.signOut();
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }
}
