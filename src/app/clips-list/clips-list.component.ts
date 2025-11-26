import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUI } from '../shared/shared-ui';
import { FbTimestampPipe } from '../pipes/fb-timestamp.pipe';
import IClip from '../models/clip.model';

@Component({
  selector: 'app-clips-list',
  standalone: true,
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  imports: [CommonModule, SharedUI, RouterModule, FbTimestampPipe],
  providers: [DatePipe],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true;

  // Angular 20: inject() function
  public clipService = inject(ClipService);
  public auth = inject(AuthService);
  private modal = inject(ModalService);
  private router = inject(Router);

  /**
   * Verifica si el clip pertenece al usuario actual
   * Retorna un Observable para usar con async pipe en el template
   */
  isOwner(clip: IClip): Observable<boolean> {
    return this.auth.currentUser$.pipe(
      map(user => user?.uid === clip.uid)
    );
  }

  /**
   * Abre el modal de edición
   */
  openEditModal(event: Event, clip: IClip): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/manage'], { queryParams: { edit: clip.docID } });
  }

  /**
   * Elimina un clip
   */
  async deleteClip(event: Event, clip: IClip): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
      try {
        await this.clipService.deleteClip(clip);
        // Recargar la lista
        this.clipService.resetPageClips();
        await this.clipService.getClips();
      } catch (error) {
        console.error('Error eliminando el clip:', error);
        alert('Error al eliminar el video');
      }
    }
  }

  ngOnInit(): void {
    // Cargar clips después de que Angular complete la inicialización
    this.clipService.getClips();

    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }
  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipService.resetPageClips();
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;

    const { innerHeight } = window;

    const bottomOfWindow =
      Math.round(scrollTop) + innerHeight < offsetHeight - 100;

    if (bottomOfWindow) {
      this.clipService.getClips();
    }
  };

  /**
   * Maneja errores al cargar imágenes (cuando el archivo no existe en Storage)
   */
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Usar una imagen placeholder cuando la imagen original no existe
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzI4MzA0NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
    img.style.backgroundColor = '#283046';
    console.warn('Imagen no encontrada, usando placeholder');
  }
}