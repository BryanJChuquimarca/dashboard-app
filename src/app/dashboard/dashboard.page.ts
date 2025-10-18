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
} from '@ionic/angular/standalone';

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
  ],
})
export class DashboardPage implements OnInit {

  constructor(private http: HttpClient) {}
  public itemsDashboard: any[] = [];
  ngOnInit() {
    this.loadDashboard();
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
}
