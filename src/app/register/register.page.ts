import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule],
})
export class RegisterPage implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  toastr = inject(ToastrService);

  public user: any = {
    name: '',
    email: '',
    password: '',
    password_confirm: '',
  };

  ngOnInit() {}

  onRegister() {
    console.log('Usuario a registrar:', this.user.name);

    if (this.user.password !== this.user.password_confirm) {
      console.error('Las contraseñas no coinciden');
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    this.http
      .post(`${environment.apiUrl}/api/auth/register`, this.user)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.toastr.success(
            'Registro exitoso. Por favor, inicia sesión.',
            'Éxito',
          );
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error en el registro:', error);
          this.toastr.error('Error en el registro: ', 'Error');
        },
      );
  }
}
