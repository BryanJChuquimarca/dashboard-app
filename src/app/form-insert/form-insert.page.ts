import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  ModalController,
  IonButton,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonTextarea,
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  checkmarkOutline,
  textOutline,
  documentTextOutline,
  flagOutline,
  addCircleOutline,
  saveOutline,
  timeOutline,
  syncOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
@Component({
  selector: 'app-form-insert',
  templateUrl: './form-insert.page.html',
  styleUrls: ['./form-insert.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    IonButton,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonTextarea,
  ],
})
export class FormInsertPage implements OnInit {
  title: string = '';
  description: string = '';
  status: string = 'pending';
  item: any = null;
  isEditMode: boolean = false;
  toastr = inject(ToastrService);

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
  ) {
    addIcons({
      closeOutline,
      checkmarkOutline,
      textOutline,
      documentTextOutline,
      flagOutline,
      addCircleOutline,
      saveOutline,
      timeOutline,
      syncOutline,
      checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    if (this.isEditMode && this.item) {
      this.title = this.item.title;
      this.description = this.item.description;
      this.status = this.item.status;
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.title.trim()) {
      this.toastr.warning('El título es obligatorio', 'Falta Título');
      return;
    }

    const taskData = {
      title: this.title,
      description: this.description,
      status: this.status,
    };

    if (this.isEditMode && this.item) {
      this.http
        .patch(`${environment.apiUrl}/api/dashboard/${this.item.id}`, taskData)
        .subscribe(
          (response: any) => {
            console.log('Tarea actualizada:', response);
            this.toastr.info(
              'Se ha actualizado la tarea correctamente',
              'Tarea Actualizada',
            );
            return this.modalCtrl.dismiss(response, 'confirm');
          },
          (error) => {
            console.error('Error al actualizar tarea:', error);
            this.toastr.error(
              'Error al actualizar: ' + (error.error?.message || error.message),
            );
          },
        );
    } else {
      this.http.post(`${environment.apiUrl}/api/dashboard`, taskData).subscribe(
        (response: any) => {
          console.log('Tarea creada:', response);
          this.toastr.success(
            'Se ha creado la tarea correctamente',
            'Tarea Creada',
          );
          return this.modalCtrl.dismiss(response, 'confirm');
        },
        (error) => {
          console.error('Error al crear tarea:', error);
          this.toastr.error(
            'Error al crear la tarea: ' +
              (error.error?.message || error.message),
          );
        },
      );
    }
  }
}
