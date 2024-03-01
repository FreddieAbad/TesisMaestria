import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL_REGISTRO } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  role: string = '';
  email: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  registerUser() {
    const userData = {
      password: this.password,
      role: this.role,
      email: this.email,
      username: this.username
    };
    console.log('>>> Password:', userData.password, ' Role:', userData.role, ' Email:', userData.email, ' Username:', userData.username);
    
    this.http.post(API_URL_REGISTRO, userData)
      .subscribe(
        response => {
          alert('Registro exitoso:\n' + JSON.stringify(response));
          this.goToLoginPage();

        },
        error => {
          alert('Error al registrar usuario:\n' + JSON.stringify(error));
        }
      );
  }

  goToLoginPage() {
    this.router.navigateByUrl('/');
  }
}
