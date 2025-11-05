import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Category, SubCategory } from '../../core/types';

const numberOrFloatValidator = (requiredErrorMessage: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return { required: requiredErrorMessage };
    }

    if (value < 0.1) {
      return {
        negativeNumber:
          'Παρακαλώ συμπληρώστε έναν θετικό αριθμό από 0.1 και πάνω',
      };
    }

    const valueStr = String(value).trim();
    const regex = /^-?\d+(\.\d{2})?$/;

    const isValid = regex.test(valueStr);

    return isValid ? null : { invalidNumberFormat: 'Μη έγκυρος αριθμός' };
  };
};

export const newProductFormGroup = new FormGroup({
  code: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  }),
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  }),
  category: new FormControl<Category | null>(null, {
    nonNullable: true,
    validators: [Validators.required],
  }),
  subCategory: new FormControl<SubCategory | null>(null, {
    nonNullable: true,
    validators: [Validators.required],
  }),
  price: new FormControl<number | null>(null, {
    nonNullable: true,
    validators: [
      numberOrFloatValidator('Παρακαλώ συμπληρώστε την τιμή του προϊόντος'),
    ],
  }),
  description: new FormControl(''),
  colour: new FormControl('#6466f1'),
});
