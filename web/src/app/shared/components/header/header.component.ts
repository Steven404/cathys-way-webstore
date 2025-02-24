import { NgIf, ViewportScroller } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Image } from 'primeng/image';
import { TieredMenu } from 'primeng/tieredmenu';

import { Category } from '../../../../../../commonTypes';

@Component({
  selector: 'app-header',
  imports: [Image, Button, Drawer, TieredMenu, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnChanges {
  isSidebarVisible = false;

  @Input() categories: Category[] = [];

  items: MenuItem[] = [
    {
      label: 'Κοσμήματα',
    },
  ];

  constructor(
    private router: Router,
    private scroller: ViewportScroller,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories'] && changes['categories'].currentValue.length) {
      this.items[0].items = this.categories.map((v) => ({
        label: v.name,
        styleClass: 'font-montserrat',
        routerLink: 'category/' + v.id,
      }));
    }
  }

  navigateToHome() {
    this.router.navigate(['home']);
  }

  changeSidebarVisibleState() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  goToCategories() {
    this.scroller.scrollToAnchor('categories');
  }
}
