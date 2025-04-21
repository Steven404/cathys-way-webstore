import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    InputText,
    IconField,
    InputIcon,
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  standalone: true,
})
export class TextInputComponent implements OnInit {
  @Input() maxLength = '';
  @Input() label = '';
  @Input() placeholder = '';

  @Input() inputId = '';
  @Input() control = new FormControl<string | number | null>(null);
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() type: 'text' | 'number' | 'password' = 'text';
  @Input() isPassword = false;
  @Input() primeIcon: '' | PrimeIcons = '';

  isPasswordVisible = false;
  windowWidth = 0;

  changePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    if (this.isPasswordVisible) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.windowWidth = window.innerWidth;
    }
    if (this.isPassword) {
      this.type = 'password';
    }
  }

  protected readonly String = String;
}
