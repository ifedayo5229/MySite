import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 
  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> 
  {
    debugger
    
    const requestForApis = request.url.startsWith(environment.apiUrl);
    const isLoggedIn = this.tokenService.isLoggedIn();

    console.log('🔍 AUTH INTERCEPTOR - Request URL:', request.url);
    console.log('🔍 AUTH INTERCEPTOR - Is Logged In:', isLoggedIn);
    
    if(!isLoggedIn){this.router.navigate(['signin']);}

    if (isLoggedIn && requestForApis) {
      let session = this.tokenService.getSession();
      if (session){
        // Extract user information from JWT token claims
        const userEmail = this.tokenService.getUserEmail();
        const userName = this.tokenService.getUserFullName();
        const userId = this.tokenService.getUserId();
        
        console.log('✅ Session found - Extracted from JWT:');
        console.log('  - User Email:', userEmail);
        console.log('  - User Name:', userName);
        console.log('  - User ID:', userId);
        
        // Add Authorization Bearer token and user information headers
        request = request.clone({ 
          headers: request.headers
            .set('Authorization', `Bearer ${session.accessToken}`)
            .set('X-User-Email', userEmail)
            .set('X-User-Name', userName)
            .set('X-User-Id', userId)
        });
        
        console.log('📤 HEADERS BEING SENT:');
        console.log('  - Authorization:', request.headers.get('Authorization')?.substring(0, 20) + '...');
        console.log('  - X-User-Email:', request.headers.get('X-User-Email'));
        console.log('  - X-User-Name:', request.headers.get('X-User-Name'));
        console.log('  - X-User-Id:', request.headers.get('X-User-Id'));
        console.log('📋 All Headers:', request.headers.keys());
      }
      
    }
    return next.handle(request);
  }
}
export const AuthInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };