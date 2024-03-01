import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL_LOGIN } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    const data = { username: this.username, password: this.password };
    
    this.http.post(API_URL_LOGIN, data).subscribe(
      (response: any) => {
        console.log('Login successful');
        this.goToHomeAuthPage();
      },
      (error: any) => {
        console.error('Login failed:', error);
        alert('Login failed:\n' + JSON.stringify(error));

      }
    );
  }

  goToHomeAuthPage() {
    this.router.navigateByUrl('/configurepyscan');
  }

  goToSignUpPage() {
    this.router.navigateByUrl('/signup');
  }
}
