import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule, provideRouter } from '@angular/router';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SnackbarComponent } from './pages/admin/shared/snackbar/snackbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './core/guards/auth.guard';
import { RedirectGuard } from './core/guards/redirect.guard';
import { TokenInterceptor } from './core/interceptor/token-interceptor';
import { AuthService } from './core/services/auth.service';
import { SnackBarService } from './core/utils/snack-bar.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    SnackbarComponent
  ],
  providers: [
    provideRouter(appRoutes),
    AuthService,
    AuthGuard,
    RedirectGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 4500 }
    },
    SnackBarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
