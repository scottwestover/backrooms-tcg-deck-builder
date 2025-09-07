import * as Sentry from '@sentry/angular';
import { DatePipe } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import {
  provideFirestore,
  getFirestore,
  enableIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
} from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  bootstrapApplication,
  BrowserModule,
  HammerModule,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  Router,
  Routes,
  withPreloading,
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { provideStoreDevtools } from '@ngrx/store-devtools';
import 'hammerjs';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AppComponent } from './app/app.component';
import { CollectionPageComponent } from './app/features/collection/collection-page.component';
import { DeckbuilderPageComponent } from './app/features/deckbuilder/deckbuilder-page.component';
import { HelpPageComponent } from './app/features/help/help-page.component';
import { DecksPageComponent } from './app/features/decks/decks-page.component';
import { HomePageComponent } from './app/features/home/home-page.component';
import { ProfilePageComponent } from './app/features/profile/profile-page.component';
import { AuthService } from './app/services/auth.service';
import { BackroomsBackendService } from './app/services/backrooms-backend.service';
import { environment } from './environments/environment';
import { provideServiceWorker } from '@angular/service-worker';
import { persistentMultipleTabManager } from 'firebase/firestore';

const routes: Routes = [
  {
    path: 'decks',
    component: DecksPageComponent,
  },
  {
    path: 'user',
    component: ProfilePageComponent,
  },
  {
    path: 'user/:id',
    component: ProfilePageComponent,
  },
  {
    path: 'deckbuilder/user/:userId/deck/:deckId',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'deckbuilder/:id',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'deckbuilder',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'collection',
    component: CollectionPageComponent,
  },
  {
    path: 'collection/:userId',
    component: CollectionPageComponent,
  },
  {
    path: 'help',
    component: HelpPageComponent,
  },
  { path: '**', component: HomePageComponent },
];

if (environment.production) {
  enableProdMode();
  if (environment.sentryConfig && environment.sentryConfig.dsn !== '') {
    Sentry.init({
      dsn: environment.sentryConfig.dsn,
      sendDefaultPii: true,
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      FontAwesomeModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserModule,
      HammerModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFireAnalyticsModule,
      ToastrModule.forRoot({}),
      DialogModule,
      ConfirmDialogModule,
      ToastModule,
      BlockUIModule,
      ProgressSpinnerModule,
      TooltipModule,
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => {
        return initializeFirestore(getApp(), {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
      }),
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    ReactiveFormsModule,
    AuthService,
    BackroomsBackendService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    MessageService,
    ConfirmationService,
    DatePipe,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
}).catch((err) => console.error(err));
