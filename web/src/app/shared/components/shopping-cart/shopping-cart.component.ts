import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Button } from 'primeng/button';

import { convertPriceToFloat } from '../../common';
import { ShoppingCartService } from '../../services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [Button, CurrencyPipe, NgIf, NgFor],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  @Output() isShoppingCartVisibleEmitter = new EventEmitter<boolean>();

  constructor(protected shoppingCartService: ShoppingCartService) {}

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
