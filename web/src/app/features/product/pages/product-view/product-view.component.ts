import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../../../../../../commonTypes';
import { ApiService } from '../../../../shared/services/api/api.service';

@Component({
  selector: 'app-product-view',
  imports: [NgIf],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss',
})
export class ProductViewComponent implements OnInit {
  id: string;
  product: Product;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiService.getProduct(parseInt(this.id)).subscribe({
        next: (v) => {
          console.log(v);
          if (v.status === 200) {
            this.product = v.product;
          }
        },
      });
    }
  }
}
