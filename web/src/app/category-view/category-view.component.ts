import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../shared/services/api/api.service';

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
})
export class CategoryViewComponent implements OnInit {
  id: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiService.getCategoryProducts(this.id).subscribe({
        next: (v) => {
          console.log(v);
        },
      });
    }
  }
}
