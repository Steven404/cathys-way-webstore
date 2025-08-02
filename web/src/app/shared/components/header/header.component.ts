import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
    NgIf,
    BadgeDirective,
    ShoppingCartComponent,
    Menu,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('wrapper') wrapper: ElementRef;

  isSidebarVisible = false;
  isShoppingCartVisible = false;
  @Output() heightEmitter = new EventEmitter<number>();

  totalCartProducts = 0;

  @Input() categoryItems: MenuItem[];

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
