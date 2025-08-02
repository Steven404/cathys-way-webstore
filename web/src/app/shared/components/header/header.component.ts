import { NgIf } from '@angular/common';
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
import { MenuItem } from 'primeng/api';
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
    BadgeDirective,
    ShoppingCartComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('menu') pMenu: Menu;

  isSidebarVisible = false;
  isShoppingCartVisible = false;
  @Output() heightEmitter = new EventEmitter<number>();
  @Input() categoryItems: MenuItem[];

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

  changeSidebarVisibleState() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  showCart() {
    this.isShoppingCartVisible = true;
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;

  ngAfterViewInit() {
    this.heightEmitter.emit(this.wrapper.nativeElement.offsetHeight);
  }
}
