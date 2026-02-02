import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  ModalController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { FormInsertPage } from '../form-insert/form-insert.page';
import { addIcons } from 'ionicons';
import {
  listOutline,
  logOutOutline,
  addCircleOutline,
  clipboardOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,

    IonButton,

    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    FormsModule,
  ],
})
export class DashboardPage implements OnInit {
  public itemsDashboard: any[] = [];

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private router: Router,
  ) {
    addIcons({
      listOutline,
      logOutOutline,
      addCircleOutline,
      clipboardOutline,
      createOutline,
      trashOutline,
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadDashboard();
    }
  }

  loadDashboard() {
    this.http.get(`${environment.apiUrl}/api/dashboard`).subscribe(
      (response: any) => {
        console.log('Dashboard data:', response);
        this.itemsDashboard = response;
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
      },
    );
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormInsertPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.loadDashboard();
    }
  }

  async openEditModal(item: any) {
    const modal = await this.modalCtrl.create({
      component: FormInsertPage,
      componentProps: {
        item: item,
        isEditMode: true,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.loadDashboard();
    }
  }

  deleteItem(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.http.delete(`${environment.apiUrl}/api/dashboard/${id}`).subscribe(
        (response: any) => {
          console.log('Tarea eliminada:', response);
          this.loadDashboard();
        },
        (error) => {
          console.error('Error al eliminar:', error);
          alert(
            'Error al eliminar: ' + (error.error?.message || error.message),
          );
        },
      );
    }
  }

  logout() {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'medium';
      default:
        return 'medium';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in-progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  }
}
