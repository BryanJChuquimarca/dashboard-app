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
  funnelOutline,
  swapVerticalOutline,
  barChartOutline,
} from 'ionicons/icons';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgChartsModule } from 'ng2-charts';

interface ActivityLog {
  date: string;
  action: 'create' | 'edit' | 'delete' | 'status-change';
  timestamp: number;
}

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
    CdkDropList,
    CdkDrag,
    NgChartsModule,
  ],
})
export class DashboardPage implements OnInit {
  public itemsDashboard: any[] = [];
  public itemImportant: any[] = [];
  public highlightedTaskId: string | null = null;
  private readonly ACTIVITY_STORAGE_KEY = 'dashboard_activity_log';

  statusChartData = {
    labels: ['Completada', 'En Progreso', 'Pendiente'],
    datasets: [
      {
        label: 'Tareas',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(56, 203, 137, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(108, 117, 125, 0.7)',
        ],
        borderColor: [
          'rgba(56, 203, 137, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 0,
      },
    ],
  };

  statusChartData1 = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        fill: true,
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 0,
        tension: 0.4,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 0,
        pointRadius: 1,
        pointHoverRadius: 3,
      },
    ],
  };

  statusChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Estado de Tareas' },
      tooltip: {
        enabled: true,
      },
    },
  };

  statusChartOptions1 = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Últimos 7 Días',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(26, 31, 46, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e0',
        borderColor: 'rgba(102, 126, 234, 0.5)',
        borderWidth: 0,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a0aec0',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a0aec0',
          stepSize: 1,
        },
      },
    },
  };

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
      funnelOutline,
      swapVerticalOutline,
      barChartOutline,
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadDashboard();
    }
  }

  updateStatusChart() {
    const completedCount = this.itemsDashboard.filter(
      (item) => item.status === 'completed',
    ).length;
    const inProgressCount = this.itemsDashboard.filter(
      (item) => item.status === 'in-progress',
    ).length;
    const pendingCount = this.itemsDashboard.filter(
      (item) => item.status === 'pending',
    ).length;

    this.statusChartData = {
      labels: ['Completada', 'En Progreso', 'Pendiente'],
      datasets: [
        {
          label: 'Tareas',
          data: [completedCount, inProgressCount, pendingCount],
          backgroundColor: [
            'rgba(56, 203, 137, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(108, 117, 125, 0.7)',
          ],
          borderColor: [
            'rgba(56, 203, 137, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(108, 117, 125, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    console.log('Chart data updated:', this.statusChartData.datasets[0].data);
  }

  updateActivityChart() {
    this.cleanOldActivityLogs();
    const activityLogs = this.getActivityLogs();

    const now = new Date();
    const daysLabels: string[] = [];
    const activityData: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayLabel = `${dayNames[date.getDay()]} ${date.getDate()}`;
      daysLabels.push(dayLabel);

      const dateStr = this.formatDate(date);
      const changesInDay = activityLogs.filter(
        (log) => log.date === dateStr,
      ).length;

      activityData.push(changesInDay);
    }

    this.statusChartData1 = {
      labels: daysLabels,
      datasets: [
        {
          data: activityData,
          fill: true,
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: 'rgba(102, 126, 234, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.itemsDashboard,
      event.previousIndex,
      event.currentIndex,
    );
  }

  loadDashboard() {
    this.http.get(`${environment.apiUrl}/api/dashboard`).subscribe(
      (response: any) => {
        console.log('Dashboard data:', response);
        this.itemsDashboard = response;
        this.getItemImportant();
        this.updateStatusChart();
        this.updateActivityChart();
        console.log('Dashboard and chart updated');
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
      this.logActivity('create');
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
      this.logActivity('edit');
      this.loadDashboard();
    }
  }

  deleteItem(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.http.delete(`${environment.apiUrl}/api/dashboard/${id}`).subscribe(
        (response: any) => {
          console.log('Tarea eliminada:', response);
          this.logActivity('delete');
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

  getItemImportant() {
    this.http.get(`${environment.apiUrl}/api/dashboard/important`).subscribe(
      (response: any) => {
        console.log('Dashboard data:', response);
        this.itemImportant = response;
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
      },
    );
  }

  highlightTask(taskId: string) {
    this.highlightedTaskId = taskId;

    setTimeout(() => {
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      this.highlightedTaskId = null;
    }, 3000);
  }

  private logActivity(action: ActivityLog['action']) {
    const logs = this.getActivityLogs();
    const now = new Date();

    const newLog: ActivityLog = {
      date: this.formatDate(now),
      action: action,
      timestamp: now.getTime(),
    };

    logs.push(newLog);
    localStorage.setItem(this.ACTIVITY_STORAGE_KEY, JSON.stringify(logs));
    console.log(`Activity logged: ${action} at ${newLog.date}`);
  }

  private getActivityLogs(): ActivityLog[] {
    const stored = localStorage.getItem(this.ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private cleanOldActivityLogs() {
    const logs = this.getActivityLogs();
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= sevenDaysAgo;
    });

    if (filteredLogs.length !== logs.length) {
      localStorage.setItem(
        this.ACTIVITY_STORAGE_KEY,
        JSON.stringify(filteredLogs),
      );
      console.log(
        `Cleaned ${logs.length - filteredLogs.length} old activity logs`,
      );
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
