import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// NOTE: Ensure this path is correct for your unified application structure
import { routes } from './app.routes'; 
import { authInterceptor } from '@core/interceptors/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Change Detection (From Member config)
    // Optional, but good for performance if you want coalescing
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // 2. Router (From all configs)
    // Uses the single, unified 'routes' array we previously created
    provideRouter(routes), 
    
    // 3. HTTP Client & Interceptor (Combining Admin and PM logic)
    // The modern way to configure HttpClient and register interceptors
    provideHttpClient(
      withInterceptors([authInterceptor]) // Registering the function-based interceptor
    )
  ]
};