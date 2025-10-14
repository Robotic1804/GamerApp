import {
  Component,
  ElementRef,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { SharedUI } from 'src/app/shared/shared-ui';
import { ClipsListComponent } from '../clips-list/clips-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedUI, ClipsListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // Signal para referenciar el video
  heroVideo = viewChild<ElementRef<HTMLVideoElement>>('heroVideo');

  constructor() {
    // Ejecuta después de que el DOM esté completamente renderizado
    afterNextRender(() => {
      this.playVideo();
    });
  }

  private playVideo(): void {
    const videoElement = this.heroVideo()?.nativeElement;

    if (!videoElement) {
      console.warn('⚠️ Elemento de video no encontrado');
      return;
    }

    // Asegura que esté muted (obligatorio para autoplay)
    videoElement.muted = true;
    videoElement.playsInline = true;

    // Intenta reproducir el video
    const playPromise = videoElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Video reproduciéndose correctamente');
        })
        .catch((error: Error) => {
          console.warn(
            '⚠️ Autoplay bloqueado por el navegador:',
            error.message
          );

          // Fallback: reproduce al primer click o touch del usuario
          const playOnInteraction = () => {
            videoElement
              .play()
              .then(() => console.log('✅ Video iniciado tras interacción'))
              .catch((err) => console.error('❌ Error al reproducir:', err));
          };

          // Escucha eventos de interacción (solo una vez)
          document.addEventListener('click', playOnInteraction, { once: true });
          document.addEventListener('touchstart', playOnInteraction, {
            once: true,
          });
        });
    }
  }
}
