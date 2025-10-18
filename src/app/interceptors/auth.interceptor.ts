//problema que al caducarce el token y estas en el login pero aunque este caducado el token sigue en localstorage y intentas iniciar sesion da error en la llamada y no deja, se soluciono borrando el token de localstorage y volviendo a iniciar sesion
//ejemplo: yo inicie sesion hace una hora, y ahora al dar sobre un boton me ha sacado al login ya que se me a caducado el token pero al iniciar sesion no me deja me da error :
//Error en el login: SyntaxError: Failed to execute 'open' on 'XMLHttpRequest': Invalid URL
//login.page.ts:33 Error en el login: SyntaxError: Failed to execute 'open' on 'XMLHttpRequest': Invalid URL
//pero si borro el token de localstorage manualmente y vuelvo a iniciar sesion ya me deja.
//comentarios anteriores creo que solucionado, solo lo que passa ahora es que si estoy en dashboard y edito el tocken y recargo me lleva al login pero antes de cargar los datos del login me sale:
/*dashboard.page.ts:42 
 GET http://localhost:3000/api/dashboard 401 (Unauthorized)

dashboard.page.ts:56 Error loading dashboard data: 
HttpErrorResponse {headers: _HttpHeaders, status: 401, statusText: 'Unauthorized', url: 'http://localhost:3000/api/dashboard', ok: false, …}*/
// y cuando inicio secion me carga la tocken y se guarda en local pero no me carga el dashboard y tengo que recargar la pagina otra vez para que salga
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let authReq = req;

  const isAuthEndpoint = authReq.url.includes('login') || authReq.url.includes('register');

  if (!authReq.url.startsWith('http')) {
    authReq = authReq.clone({
      url: `${environment.apiUrl}${authReq.url}`, 
    });
  }
  
  if (token && !isAuthEndpoint) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};