import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Errore intercettato:', error);

        // Differenziazione degli errori
        let errorMessage = 'Si è verificato un errore. Riprova più tardi.';
        if (error.status === 0) {
          errorMessage = 'Errore di rete. Controlla la connessione.';
        } else if (error.status >= 500) {
          errorMessage = 'Errore del server. Riprova più tardi.';
        } else if (error.status >= 400) {
          errorMessage = 'Errore nella richiesta. Controlla i dati e riprova.';
        }

        // Puoi mostrare un messaggio all'utente o registrare l'errore su un sistema esterno
        alert(errorMessage); // Per esempio, mostrare un popup all'utente (opzionale)

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
