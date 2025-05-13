import { NgIf, ViewportScroller } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BadgeDirective } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Image } from 'primeng/image';
import { TieredMenu } from 'primeng/tieredmenu';

import { convertPriceToFloat } from '../../common';
import { ShoppingCartService } from '../../services/shopping-cart/shopping-cart.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-header',
  imports: [
    Image,
    Button,
    Drawer,
    TieredMenu,
    NgIf,
    BadgeDirective,
    ShoppingCartComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent {
  isSidebarVisible = false;
  isShoppingCartVisible = false;

  @Input() categoryItems: MenuItem[];

  constructor(
    private router: Router,
    private scroller: ViewportScroller,
    protected shoppingCartService: ShoppingCartService,
  ) {}

  navigateToHome() {
    this.router.navigate(['home']);
  }

  changeSidebarVisibleState() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  showCart() {
    this.isShoppingCartVisible = true;
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
