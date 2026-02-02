import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonGrid,
  IonCol,
  ModalController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { FormInsertPage } from '../form-insert/form-insert.page';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    IonCol,
    IonGrid,
    IonRow,
    FormsModule
  ],
})
export class DashboardPage implements OnInit {
  message =
    'This modal example uses the modalController to present and dismiss modals.';
  constructor(private http: HttpClient, private modalCtrl: ModalController) {}
  public itemsDashboard: any[] = [];
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
      }
    );
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormInsertPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.message = `Se ha agregado la tarea: ${data.title}`;
      // Recargar la lista de tareas
      this.loadDashboard();
    }
  }
}
