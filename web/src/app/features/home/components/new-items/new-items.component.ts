import { animate, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('fadeInFadeOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class NewItemsComponent {
  @Input() products: ProductDoc[];
}
