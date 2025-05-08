import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
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

  ngOnInit() {
    if (typeof window !== 'undefined') {
      document.getElementById('appHeader').style.display = 'none';
    }
  }

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
          this.router.navigate(['admin']);
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
