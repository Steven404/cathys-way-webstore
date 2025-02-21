import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-welcome-box',
  imports: [NgOptimizedImage, Button],
  templateUrl: './welcome-box.component.html',
  styleUrl: './welcome-box.component.scss',
  standalone: true,
})
export class WelcomeBoxComponent {
  constructor(
    private router: Router,
    private scroller: ViewportScroller,
  ) {}

  goToCategories() {
    this.scroller.scrollToAnchor('categories');
  }
}
