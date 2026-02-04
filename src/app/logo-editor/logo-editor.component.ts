import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline, refreshOutline } from 'ionicons/icons';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-logo-editor',
  templateUrl: './logo-editor.component.html',
  styleUrls: ['./logo-editor.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon],
})
export class LogoEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;

  private modalCtrl = inject(ModalController);

  private defaultPoints: Point[] = [
    { x: 260.87, y: 219.78 },
    { x: 297.81, y: 334.62 },
    { x: 200.0, y: 264.0 },
    { x: 102.19, y: 334.62 },
    { x: 139.13, y: 219.78 },
    { x: 41.74, y: 148.58 },
    { x: 162.38, y: 148.22 },
    { x: 200.0, y: 33.6 },
    { x: 237.62, y: 148.22 },
    { x: 358.26, y: 148.58 },
  ];

  points: Point[] = [];

  constructor() {
    addIcons({ saveOutline, closeOutline, refreshOutline });
  }

  ngOnInit() {
    // Cargar puntos guardados o usar los por defecto
    const savedPoints = localStorage.getItem('customLogo');
    if (savedPoints) {
      this.points = JSON.parse(savedPoints);
    } else {
      this.points = [...this.defaultPoints];
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setupInteract();
    }, 100);
  }

  setupInteract() {
    const svg = this.svgContainer.nativeElement.querySelector('svg');
    if (!svg) return;

    const handles = svg.querySelectorAll('.point-handle');

    handles.forEach((handle: any, index: number) => {
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        const rect = svg.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const rect = svg.getBoundingClientRect();
        const scaleX = 400 / rect.width;
        const scaleY = 400 / rect.height;

        const dx = (e.clientX - startX) * scaleX;
        const dy = (e.clientY - startY) * scaleY;

        const currentX = parseFloat(handle.getAttribute('cx') || '0');
        const currentY = parseFloat(handle.getAttribute('cy') || '0');

        const newX = currentX + dx;
        const newY = currentY + dy;

        const boundedX = Math.max(10, Math.min(390, newX));
        const boundedY = Math.max(10, Math.min(390, newY));

        handle.setAttribute('cx', boundedX.toString());
        handle.setAttribute('cy', boundedY.toString());

        this.points[index] = { x: boundedX, y: boundedY };
        this.updatePolygon();

        startX = e.clientX;
        startY = e.clientY;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      handle.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  updatePolygon() {
    const svg = this.svgContainer.nativeElement.querySelector('svg');
    if (!svg) return;

    const polygon = svg.querySelector('#edit-star');
    if (!polygon) return;

    const pointsString = this.points
      .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');

    polygon.setAttribute('points', pointsString);
  }

  getPointsString(): string {
    return this.points
      .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');
  }

  saveLogo() {
    localStorage.setItem('customLogo', JSON.stringify(this.points));
    this.modalCtrl.dismiss({ saved: true, points: this.points });
  }

  resetLogo() {
    this.points = [...this.defaultPoints];
    this.updatePolygon();

    // Actualizar posiciones de los handles
    const svg = this.svgContainer.nativeElement.querySelector('svg');
    if (!svg) return;

    const handles = svg.querySelectorAll('.point-handle');
    handles.forEach((handle: any, index: number) => {
      handle.setAttribute('cx', this.points[index].x);
      handle.setAttribute('cy', this.points[index].y);
    });
  }

  close() {
    this.modalCtrl.dismiss({ saved: false });
  }
}
