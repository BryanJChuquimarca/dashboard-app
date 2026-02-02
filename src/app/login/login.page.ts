import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class LoginPage implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  public user: any = {
    email: '',
    password: '',
  };

  ngOnInit() {}

  onLogin() {
    this.http.post(`${environment.apiUrl}/api/auth/login`, this.user).subscribe(
      (response: any) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        
        // Navegar después de un pequeño delay para asegurar que el token se guardó
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 100);
      },
      (error) => {
        console.error('Error en el login:', error);
        alert('Error en el login: ' + error.error.message); //cambiar alert por un modal bonito
      }
    );
  }
  onRegisterRedirect() {
    this.router.navigate(['/register']);
  }
}
