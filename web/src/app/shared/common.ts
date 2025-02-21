import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const handleError = (error: HttpErrorResponse) => {
  if (error.status === 0) {
    console.error('An error occurred:', error.error);
  } else {
    console.error(
      `Backend returned code ${error.status}, body was: `,
      error.error,
    );
  }

  if (
    (error.error.message && error.error.message.startsWith('jwt')) ||
    typeof error.error === 'object'
  ) {
    return throwError(() => new Error(JSON.stringify(error.error)));
  } else {
    return throwError(() => new Error(error.error));
  }
};
