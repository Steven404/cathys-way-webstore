import { NgIf, ViewportScroller } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Image } from 'primeng/image';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'app-header',
  imports: [Image, Button, Drawer, TieredMenu, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent {
  isSidebarVisible = false;

  @Input() categoryItems: MenuItem[];

  constructor(
    private router: Router,
    private scroller: ViewportScroller,
  ) {}

  navigateToHome() {
    this.router.navigate(['home']);
  }

  changeSidebarVisibleState() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
