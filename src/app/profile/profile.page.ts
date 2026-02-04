import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  calendarOutline,
  barChartOutline,
  clipboardOutline,
  checkmarkCircleOutline,
  timeOutline,
  syncOutline,
  pulseOutline,
  addCircleOutline,
  createOutline,
  trashOutline,
  saveOutline,
} from 'ionicons/icons';
import {
  IonContent,
  IonIcon,
  IonInput,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { LogoEditorComponent } from '../logo-editor/logo-editor.component';

interface ActivityLog {
  date: string;
  action: 'create' | 'edit' | 'delete' | 'status-change';
  timestamp: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonInput, IonButton, FormsModule],
})
export class ProfilePage implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private modalCtrl = inject(ModalController);

  userData: any = {};
  editName: string = '';
  customLogoPoints: string = '';

  stats = {
    total: 0,
    completed: 0,
    pending: 0,
    in_progress: 0,
  };

  activityStats = {
    created: 0,
    edited: 0,
    deleted: 0,
  };

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      calendarOutline,
      barChartOutline,
      clipboardOutline,
      checkmarkCircleOutline,
      timeOutline,
      syncOutline,
      pulseOutline,
      addCircleOutline,
      createOutline,
      trashOutline,
      saveOutline,
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadTaskStats();
    this.loadActivityStats();
    this.loadCustomLogo();
  }

  loadCustomLogo() {
    const savedPoints = localStorage.getItem('customLogo');
    if (savedPoints) {
      const points = JSON.parse(savedPoints);
      this.customLogoPoints = points
        .map((p: any) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(' ');
    }
  }

  async openLogoEditor() {
    const modal = await this.modalCtrl.create({
      component: LogoEditorComponent,
      cssClass: 'logo-editor-modal',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.saved) {
      this.loadCustomLogo();
      this.toastr.success('Logo personalizado guardado');
    }
  }

  hasCustomLogo(): boolean {
    return this.customLogoPoints !== '';
  }

  loadUserData() {
    this.http.get(`${environment.apiUrl}/api/user/profile`).subscribe(
      (response: any) => {
        this.userData = response[0];
        console.log('Datos del usuario cargados:', this.userData);
      },
      (error) => {
        console.error('Error al cargar usuario:', error);
        this.toastr.error('No se pudo cargar la información del usuario');
      },
    );
  }

  loadTaskStats() {
    this.http.get(`${environment.apiUrl}/api/dashboard`).subscribe(
      (response: any) => {
        const tasks = response;
        this.stats.total = tasks.length;
        this.stats.completed = tasks.filter(
          (t: any) => t.status === 'completed',
        ).length;
        this.stats.pending = tasks.filter(
          (t: any) => t.status === 'pending',
        ).length;
        this.stats.in_progress = tasks.filter(
          (t: any) => t.status === 'in-progress',
        ).length;
      },
      (error) => {
        console.error('Error al cargar estadísticas:', error);
      },
    );
  }

  loadActivityStats() {
    const activityLogs: ActivityLog[] = JSON.parse(
      localStorage.getItem('dashboard_activity_log') || '[]',
    );

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentLogs = activityLogs.filter(
      (log) => log.timestamp >= sevenDaysAgo,
    );

    this.activityStats.created = recentLogs.filter(
      (log) => log.action === 'create',
    ).length;
    this.activityStats.edited = recentLogs.filter(
      (log) => log.action === 'edit',
    ).length;
    this.activityStats.deleted = recentLogs.filter(
      (log) => log.action === 'delete',
    ).length;
  }

  updateName() {
    if (this.editName.trim() === '' || this.editName === this.userData.name) {
      this.toastr.warning('El nombre no ha cambiado');
      return;
    }

    this.http
      .patch(`${environment.apiUrl}/api/user/profile`, { name: this.editName })
      .subscribe(
        (response: any) => {
          this.userData = response.user;
          this.editName = response.user.name;
          this.toastr.success('Nombre actualizado correctamente');
        },
        (error) => {
          console.error('Error al actualizar nombre:', error);
          this.toastr.error('No se pudo actualizar el nombre');
        },
      );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
