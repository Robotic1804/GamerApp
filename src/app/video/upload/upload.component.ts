import { Component, OnDestroy, DestroyRef, inject, afterNextRender } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedUI } from 'src/app/shared/shared-ui';
import { SharedCore } from 'src/app/shared/shared-core';
import { SafeURLPipe } from '../pipes/safe-url.pipe';
import {
  Storage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from '@angular/fire/storage';

import { Auth, User, authState } from '@angular/fire/auth';

import { serverTimestamp } from '@angular/fire/firestore';

import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { EventBlockerDirective } from 'src/app/shared/directives/event-blocker.directive';
import IClip from 'src/app/models/clip.model';

@Component({
  selector: 'app-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [...SharedUI, ...SharedCore, SafeURLPipe, EventBlockerDirective],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded.';
  inSubmission = false;

  percentage = 0;
  showPercentage = false;

  user: User | null = null;

  // Upload tasks (modular)
  task?: UploadTask;
  screenshotTask?: UploadTask;

  screenshots: string[] = [];
  selectedScreenshot = '';

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  uploadForm = new FormGroup({
    title: this.title,
  });

  // subjects para el progreso (0–100)
  private clipProgress$ = new BehaviorSubject<number>(0);
  private screenshotProgress$ = new BehaviorSubject<number>(0);

  // Angular 20: inject() function - Mejor práctica moderna
  private storage = inject(Storage);
  private auth = inject(Auth);
  private clipsService = inject(ClipService);
  private router = inject(Router);
  public ffmpegService = inject(FfmpegService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Angular 20: takeUntilDestroyed - Cleanup automático
    authState(this.auth)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => (this.user = user));

    // Inicializar FFmpeg de forma asíncrona
    afterNextRender(async () => {
      try {
        await this.ffmpegService.init();
      } catch (error) {
        console.error('Error al inicializar FFmpeg:', error);
        // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
      }
    });

    combineLatest([this.clipProgress$, this.screenshotProgress$])
      .pipe(
        map(([c, s]) => (c + s) / 2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((pct) => (this.percentage = pct));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
    this.screenshotTask?.cancel();
  }

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning) return;

    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') return;

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  // 👇 NUEVO: Método para cancelar la subida
  cancelUpload(): void {
    // Cancela las tareas de upload si existen
    this.task?.cancel();
    this.screenshotTask?.cancel();

    // Resetea los valores
    this.inSubmission = false;
    this.showAlert = false;
    this.showPercentage = false;
    this.percentage = 0;
    this.clipProgress$.next(0);
    this.screenshotProgress$.next(0);

    // Habilita el formulario nuevamente
    this.uploadForm.enable();

    // Muestra mensaje de cancelación
    this.showAlert = true;
    this.alertColor = 'orange';
    this.alertMsg = 'Upload cancelled by user.';

    // Oculta el mensaje después de 3 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  async uploadFile() {
    if (!this.file || !this.selectedScreenshot) return;

    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.png`;

    const clipRef = storageRef(this.storage, clipPath);
    const screenshotRef = storageRef(this.storage, screenshotPath);

    this.task = uploadBytesResumable(clipRef, this.file);
    this.screenshotTask = uploadBytesResumable(screenshotRef, screenshotBlob);

    this.task.on('state_changed', (snap) => {
      this.clipProgress$.next((snap.bytesTransferred / snap.totalBytes) * 100);
    });

    this.screenshotTask.on('state_changed', (snap) => {
      this.screenshotProgress$.next(
        (snap.bytesTransferred / snap.totalBytes) * 100
      );
    });

    try {
      await Promise.all([this.task, this.screenshotTask]);

      const [clipURL, screenshotURL] = await Promise.all([
        getDownloadURL(clipRef),
        getDownloadURL(screenshotRef),
      ]);

      const clip: Partial<IClip> = {
        uid: this.user?.uid as string,
        displayName: this.user?.displayName as string,
        title: this.title.value ?? '',
        fileName: `${clipFileName}.mp4`,
        url: clipURL,
        screenshotURL,
        screenshotFileName: `${clipFileName}.png`,
        timestamp: serverTimestamp(),
      };

      const clipDocRef = await this.clipsService.createClip(clip as IClip);

      this.alertColor = 'green';
      this.alertMsg =
        'Success! Your clip is now ready to share with the world.';
      this.showPercentage = false;

      setTimeout(() => {
        this.router.navigate(['clip', clipDocRef.id]);
      }, 1000);
    } catch (error: any) {
      // 👇 Verifica si fue cancelado por el usuario
      if (error.code === 'storage/canceled') {
        console.log('Upload was cancelled');
        return; // No muestra error si fue cancelación intencional
      }

      this.uploadForm.enable();
      this.alertColor = 'red';
      this.alertMsg = 'Upload failed! Please try again later.';
      this.inSubmission = false;
      this.showPercentage = false;
      console.error(error);
    }
  }
}
