import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import firebase from 'firebase/compat';
import { providePrimeNG } from 'primeng/config';

import { customPreset } from '../primengTheme';
import { routes } from './app.routes';
import initializeApp = firebase.initializeApp;
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { environment } from '../environments/environment';

// noinspection TypeScriptValidateTypes
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    providePrimeNG({
      theme: {
        preset: customPreset,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
