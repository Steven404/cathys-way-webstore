import { NgForOf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';

import { ProductDoc } from '../../../../core/types';
import { ProductCardComponent } from '../../../product/components/product-card/product-card.component';

@Component({
  selector: 'app-new-items',
  imports: [ProductCardComponent, NgForOf, Button],
  templateUrl: './new-items.component.html',
  styleUrl: './new-items.component.scss',
})
export class NewItemsComponent {
  @Input() products: ProductDoc[];
}
