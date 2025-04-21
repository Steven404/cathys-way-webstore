import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { AuthService } from '../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [TextInputComponent, Button, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoading = false;

  usernameControl: FormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  passwordControl: FormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  getControlsValidStatus() {
    return this.usernameControl.valid && this.passwordControl.valid;
  }

  signIn() {
    if (!this.usernameControl.valid || !this.passwordControl.valid) {
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.authService
      .signIn(this.usernameControl.value, this.passwordControl.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          // this.router.navigate(['admin']);
          console.log('logged in successfully');
        },
        error: (e) => {
          console.log(e.code);
          if (e.code === 'auth/invalid-email') {
            this.errorMessage =
              'Δεν υπάρχει λογαριασμός με το email που δώσατε';
          } else if (e.code === 'auth/invalid-credential') {
            this.errorMessage = 'Λανθασμένος κωδικός πρόσβασης';
          }
          this.isLoading = false;
        },
      });
  }
}
