import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-create-category-dialog',
  imports: [TextInputComponent, Dialog, Button],
  templateUrl: './create-category-dialog.component.html',
  styleUrl: './create-category-dialog.component.scss',
  standalone: true,
})
export class CreateCategoryDialogComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() createCategoryEmitter = new EventEmitter();

  @Input() isLoading = false;

  @Input() categoryFormControl: FormControl;

  onDialogHide() {
    this.categoryFormControl.reset();
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }
}
