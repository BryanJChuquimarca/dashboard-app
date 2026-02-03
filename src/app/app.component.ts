import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  AlertController,
  IonApp,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
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
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  heartOutline,
  heartSharp,
  archiveOutline,
  archiveSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  bookmarkOutline,
  bookmarkSharp,
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
    IonListHeader,
    IonNote,
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
    { title: 'Inbox', url: '/login', icon: 'mail' },
    { title: 'Outbox', url: '/dashboard', icon: 'paper-plane' },
    { title: 'Favorites', url: '/profile', icon: 'heart' },
    { title: 'Archived', url: '/register', icon: 'archive' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public showMenu = true;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({
      logOutOutline,
      mailOutline,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
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
}
