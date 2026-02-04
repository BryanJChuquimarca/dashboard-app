import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  AlertController,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { FormInsertPage } from '../form-insert/form-insert.page';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  downloadOutline,
  listOutline,
  logOutOutline,
  addCircleOutline,
  clipboardOutline,
  createOutline,
  trashOutline,
  funnelOutline,
  swapVerticalOutline,
  barChartOutline,
  timeOutline,
  flagOutline,
  syncOutline,
  checkmarkOutline,
  saveOutline,
  closeOutline,
  textOutline,
  documentTextOutline,
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
    IonFab,
    IonFabButton,
    IonFabList,
  ],
})
export class DashboardPage implements OnInit {
  public itemsDashboard: any[] = [];
  public itemsDashboardOriginal: any[] = [];
  public showDownloadMenu = false;
  public itemImportant: any[] = [];
  public highlightedTaskId: string | null = null;
  private readonly ACTIVITY_STORAGE_KEY = 'dashboard_activity_log';
  public currentFilter:
    | 'none'
    | 'date'
    | 'completed'
    | 'in-progress'
    | 'pending'
    | 'alphabetic' = 'none';
  public filterLabel: string = 'Filtrar';
  toastr = inject(ToastrService);
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
    private alertCtrl: AlertController,
    private router: Router,
  ) {
    addIcons({
      alertCircleOutline,
      downloadOutline,
      documentTextOutline,
      textOutline,
      closeOutline,
      saveOutline,
      checkmarkOutline,
      syncOutline,
      flagOutline,
      timeOutline,
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
        this.itemsDashboardOriginal = [...response];
        this.updateStatusChart();
        this.updateActivityChart();
        console.log('Dashboard and chart updated');
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
        this.toastr.error(
          'ha ocurrido un error al cargar el dashboard',
          'Error',
        );
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

  async deleteItem(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.http
              .delete(`${environment.apiUrl}/api/dashboard/${id}`)
              .subscribe(
                (response: any) => {
                  this.logActivity('delete');
                  this.loadDashboard();
                  this.toastr.success('¡Tarea eliminada con éxito!', 'Éxito');
                },
                (error) => {
                  console.error('Error al eliminar:', error);
                  this.toastr.error(
                    'Error al eliminar!',
                    error.error?.message || error.message,
                  );
                },
              );
          },
        },
      ],
    });

    await alert.present();
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
        this.toastr.info('¡Tareas importantes cargadas!', 'Info');
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
        this.toastr.error(
          'No se ha podido solicitar a la ia las tareas',
          'Error',
        );
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

  downloadItem(
    tipo: 'todas' | 'completed' | 'pending' | 'individual' | 'in-progress',
    tarea?: any,
  ) {
    const doc = new jsPDF();
    let datosParaExportar = this.itemsDashboard;
    let titulo = '';

    let date = new Date();
    if (tipo === 'todas') {
      datosParaExportar = this.itemsDashboard;
      titulo = `Reporte_Total_Tareas_${date.toISOString().split('T')[0]}`;
    } else {
      datosParaExportar = this.itemsDashboard.filter((t) => t.status === tipo);
      titulo = `Tareas_${tipo}_${date.toISOString().split('T')[0]}`;
    }
    doc.text(titulo.replace('_', ' '), 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['ID', 'Título', 'Descripción', 'Estado', 'Fecha']],
      body: datosParaExportar.map((t) => [
        t.id,
        t.title,
        t.description,
        t.status,
        t.created_at.split('T')[0],
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 133, 244] },
    });

    doc.save(`${titulo}.pdf`);
    this.toastr.success('¡Descarga completada!', 'Éxito');
  }

  filterItems() {
    const filterSequence: Array<typeof this.currentFilter> = [
      'none',
      'date',
      'completed',
      'in-progress',
      'pending',
      'alphabetic',
    ];

    const currentIndex = filterSequence.indexOf(this.currentFilter);
    const nextIndex = (currentIndex + 1) % filterSequence.length;
    this.currentFilter = filterSequence[nextIndex];

    this.applyFilter();
  }

  private applyFilter() {
    switch (this.currentFilter) {
      case 'none':
        this.itemsDashboard = [...this.itemsDashboardOriginal];
        this.filterLabel = 'Filtrar';
        this.toastr.info('Mostrando orden original', 'Filtro');
        break;

      case 'date':
        this.itemsDashboard = [...this.itemsDashboardOriginal].sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        this.filterLabel = 'Por Fecha';
        this.toastr.info(
          'Ordenado por fecha (más recientes primero)',
          'Filtro',
        );
        break;

      case 'completed':
        this.itemsDashboard = this.itemsDashboardOriginal
          .filter((item) => item.status === 'completed')
          .sort((a, b) => a.title.localeCompare(b.title));
        this.filterLabel = 'Completadas';
        this.toastr.info('Mostrando solo tareas completadas', 'Filtro');
        break;

      case 'in-progress':
        this.itemsDashboard = this.itemsDashboardOriginal
          .filter((item) => item.status === 'in-progress')
          .sort((a, b) => a.title.localeCompare(b.title));
        this.filterLabel = 'En Progreso';
        this.toastr.info('Mostrando solo tareas en progreso', 'Filtro');
        break;

      case 'pending':
        this.itemsDashboard = this.itemsDashboardOriginal
          .filter((item) => item.status === 'pending')
          .sort((a, b) => a.title.localeCompare(b.title));
        this.filterLabel = 'Pendientes';
        this.toastr.info('Mostrando solo tareas pendientes', 'Filtro');
        break;

      case 'alphabetic':
        this.itemsDashboard = [...this.itemsDashboardOriginal].sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        this.filterLabel = 'A-Z';
        this.toastr.info('Ordenado alfabéticamente', 'Filtro');
        break;
    }
  }
}
