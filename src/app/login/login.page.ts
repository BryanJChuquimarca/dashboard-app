import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule],
})
export class LoginPage implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public user: any = {
    email: '',
    password: '',
  };
  toastr = inject(ToastrService);

  ngOnInit() {}

  onLogin() {
    this.http.post(`${environment.apiUrl}/api/auth/login`, this.user).subscribe(
      (response: any) => {
        console.log(response);
        localStorage.setItem('token', response.token);

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 100);
      },
      (error) => {
        console.error('Error en el login:', error);
        this.toastr.error('Error en el login: ' + error.error.message);
      },
    );
  }
  onRegisterRedirect() {
    this.router.navigate(['/register']);
  }
}
