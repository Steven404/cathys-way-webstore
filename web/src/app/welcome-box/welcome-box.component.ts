import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-welcome-box',
  imports: [NgOptimizedImage, Button],
  templateUrl: './welcome-box.component.html',
  styleUrl: './welcome-box.component.scss',
  standalone: true,
})
export class WelcomeBoxComponent {}
