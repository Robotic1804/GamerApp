import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { environment } from './app/enviroment';


// ✅ Firebase modular SDK imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// ✅ Inicializa Firebase con la nueva API modular
const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

let appInit = false;

// Espera a que Firebase confirme el estado de autenticación
onAuthStateChanged(auth, () => {
  if (!appInit) {
    bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(), // Si usas otros módulos como HttpClientModule, agrégalos aquí
        provideRouter(appRoutes),
      ],
    }).catch((err) => console.error(err));

    appInit = true;
  }
});
