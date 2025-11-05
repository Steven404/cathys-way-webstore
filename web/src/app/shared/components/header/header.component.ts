import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { BadgeDirective } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Image } from 'primeng/image';
import { Menu } from 'primeng/menu';

import { StoreType } from '../../../core/types';
import { convertPriceToFloat } from '../../common';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-header',
  imports: [
    Image,
    Button,
    Drawer,
    Menu,
    NgIf,
    NgFor,
    BadgeDirective,
    ShoppingCartComponent,
    PrimeTemplate,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms 300ms ease-in', style({ opacity: 1 })),
      ]),
      // transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('menu') pMenu: Menu;

  isSidebarVisible = false;
  isShoppingCartVisible = false;
  isProductsMenuExpanded = false;
  @Output() heightEmitter = new EventEmitter<number>();
  @Input() categoryItems: MenuItem[] = [];

  totalCartProducts = 0;
  isMenuVisible = false;

  @HostListener('document:click', [])
  onClick(): void {
    if (this.isMenuVisible) {
      this.pMenu.hide();
      this.isMenuVisible = false;
      return;
    }
    if (this.pMenu && this.pMenu.visible && !this.isMenuVisible) {
      this.isMenuVisible = true;
    }
  }

  @HostListener('window:resize', [])
  resize() {
    if (this.wrapper) {
      this.heightEmitter.emit(this.wrapper.nativeElement.offsetHeight);
    }
  }

  constructor(
    private router: Router,
    private store: Store<StoreType>,
  ) {
    this.store.select('shoppingCart').subscribe((cart) => {
      this.totalCartProducts = cart.length;
    });
  }

  navigateToHome() {
    this.isSidebarVisible = false;
    this.router.navigate(['home']);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  navigateToCategory(navigationCallback: Function) {
    this.isSidebarVisible = false;
    navigationCallback();
  }

  changeSidebarVisibleState() {
    this.isSidebarVisible = !this.isSidebarVisible;
    // Reset the products menu when closing the drawer
    if (!this.isSidebarVisible) {
      this.isProductsMenuExpanded = false;
    }
  }

  toggleProductsMenu() {
    this.isProductsMenuExpanded = !this.isProductsMenuExpanded;
    this.isMenuVisible = false;
  }

  showCart() {
    this.isShoppingCartVisible = true;
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;

  ngAfterViewInit() {
    this.heightEmitter.emit(this.wrapper.nativeElement.offsetHeight);
  }
}
