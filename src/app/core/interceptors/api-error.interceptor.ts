import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({ count: 2, delay: 600 }),
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || error.message || 'Something went wrong while loading data.';
      return throwError(() => new Error(message));
    })
  );
};
