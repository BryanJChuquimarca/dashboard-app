import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  saveOutline
} from 'ionicons/icons';

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
    CommonModule,
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
      saveOutline
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
      alert('El título es obligatorio');
      return;
    }

    const taskData = {
      title: this.title,
      description: this.description,
      status: this.status,
    };

    if (this.isEditMode && this.item) {
      this.http.patch(`${environment.apiUrl}/api/dashboard/${this.item.id}`, taskData).subscribe(
        (response: any) => {
          console.log('Tarea actualizada:', response);
          return this.modalCtrl.dismiss(response, 'confirm');
        },
        (error) => {
          console.error('Error al actualizar tarea:', error);
          alert('Error al actualizar: ' + (error.error?.message || error.message));
        }
      );
    } else {
      this.http.post(`${environment.apiUrl}/api/dashboard`, taskData).subscribe(
        (response: any) => {
          console.log('Tarea creada:', response);
          return this.modalCtrl.dismiss(response, 'confirm');
        },
        (error) => {
          console.error('Error al crear tarea:', error);
          alert('Error al crear la tarea: ' + (error.error?.message || error.message));
        }
      );
    }
  }
}
