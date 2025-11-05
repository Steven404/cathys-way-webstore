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

export const convertPriceToFloat = (price: string | number) => {
  if (typeof price === 'string') {
    return Number(price).toFixed(2);
  }

  return price.toFixed(2);
};

export const removeGreekTonos = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const generateOrderNumberFromUUID = (uuid) => {
  // Take part of the UUID for uniqueness
  const shortId = uuid.split('-')[0].toUpperCase(); // e.g. "A3F6B0A2"

  // Add a readable prefix
  const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();

  return `ORD-${shortId}-${randomSuffix}`;
};
