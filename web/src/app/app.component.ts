import { isPlatformBrowser, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  inject,
  Injector,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { CartPersistenceServiceService } from './core/services/cart-persistence-service/cart-persistence-service.service';
import { StoreType } from './core/types';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { CategoryService } from './shared/services/category/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cathys-way-webstore';

  injector = inject(Injector);

  @ViewChild('content') content: ElementRef;
  @ViewChild('footer') footer: ElementRef;

  categoryItems: MenuItem[] = [];
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private store: Store<StoreType>,
    private cartPersistenceServiceService: CartPersistenceServiceService,
  ) {}

  get categories() {
    return this.categoryService.categoriesSignal();
  }

  get showHeaderFooter(): boolean {
    const url = this.router.url;
    // Hide header/footer for admin dashboard and login (and their subroutes)
    return !(
      url.startsWith('/admin/dashboard') ||
      url.startsWith('/admin/login') ||
      url.startsWith('/order-placed')
    );
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initApp();

      // Subscribe to router events after view initialization
      this.router.events.subscribe((event) => {
        if (
          event instanceof NavigationEnd &&
          event.url.startsWith('/order-placed')
        ) {
          // Use setTimeout to ensure the view is fully initialized
          setTimeout(() => {
            if (this.content?.nativeElement) {
              this.content.nativeElement.style.marginTop = `0`;
            }
          }, 0);
        }
      });
    }
  }

  async initApp() {
    await import('hammerjs');
    await this.loadCategories();

    this.cartPersistenceServiceService.initCartFromStorage();
    this.cartPersistenceServiceService.subscribeCartChangesToLocalStorage();
  }

  async loadCategories() {
    await this.categoryService.fetchCategories();
    this.categories.forEach((c) =>
      this.categoryItems.push({
        label: c.name,
        command: () => this.router.navigate([`category/${c.id}`]),
      }),
    );
  }

  setContentStyle(event: number) {
    setTimeout(() => {
      if (typeof window !== 'undefined' && this.showHeaderFooter) {
        if (this.content?.nativeElement) {
          this.content.nativeElement.style.marginTop = `${event}px`;
        }

        if (this.footer?.nativeElement && this.content?.nativeElement) {
          const footerHeight = this.footer.nativeElement.offsetHeight;
          this.content.nativeElement.style.minHeight = `${window.innerHeight - footerHeight - event}px`;
        }
      }
    }, 250);
  }
}
