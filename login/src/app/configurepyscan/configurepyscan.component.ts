import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL_GETUSERS } from '../config';

@Component({
  selector: 'app-configurepyscan',
  templateUrl: './configurepyscan.component.html',
  styleUrl: './configurepyscan.component.css'
})
export class ConfigurepyscanComponent {
  constructor(private http: HttpClient, private router: Router) {}

  goToSignUpPage() {
    this.router.navigateByUrl('/signup');
  }
  goToHomeAuth() {
    this.router.navigateByUrl('/homeauth');
  }
  users: any[] = [];


  ngOnInit(): void {
    this.http.get<any>(API_URL_GETUSERS).subscribe(
      data => {
        if (data.code === '200') {
          this.users = data.users;
        } else {
          console.error('Error retrieving users:', data.message);
        }
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

}
