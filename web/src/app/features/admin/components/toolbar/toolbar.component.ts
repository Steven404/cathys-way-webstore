import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

import { AuthService } from '../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-toolbar',
  imports: [Button, Toolbar],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  standalone: true,
})
export class ToolbarComponent {
  firebaseAuth = inject(AuthService);

  @Output() addProductEmitter = new EventEmitter();
  @Output() addCategoryEmitter = new EventEmitter();
  @Output() addSubCategoryEmitter = new EventEmitter();

  signOut() {
    this.firebaseAuth.signOut();
  }
}
