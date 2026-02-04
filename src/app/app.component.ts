import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  AlertController,
  IonApp,
  IonMenu,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  homeSharp,
  personSharp,
  personOutline,
  logOutOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonButton,
    IonHeader,
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'Perfil', url: '/profile', icon: 'person' },
  ];
  public showMenu = true;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({
      homeOutline,
      homeSharp,
      personSharp,
      personOutline,
      logOutOutline,
    });
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showMenu = !(
        currentUrl.includes('/login') || currentUrl.includes('/register')
      );
    });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Cerrar sesión',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await alert.present();
  }
  goToprofile() {
    this.router.navigate(['/profile']);
  }
  goToHome() {
    this.router.navigate(['/dashboard']);
  }
}
