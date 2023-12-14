import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { eLocalSrorage } from './sharedenums';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private allowedUrls: string[] = [
    'http://localhost:3000/api/users',
    'http://localhost:3000/api/users/update-user/',
    'http://localhost:3000/api/users/delete-user',
    'http://localhost:3000/api/users/get-user/',
  ];

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isAllowedUrl(request.url)) {
      let token = localStorage.getItem(eLocalSrorage.Token) || '';
      request = request.clone({
        setHeaders: {
          authorization: token,
        },
      });
    }

    return next.handle(request);
  }

  private isAllowedUrl(url: string): boolean {
    return this.allowedUrls.some((allowedUrl) => url.startsWith(allowedUrl));
  }
}
