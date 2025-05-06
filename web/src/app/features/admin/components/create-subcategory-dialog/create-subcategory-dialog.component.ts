import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-create-subcategory-dialog',
  imports: [Dialog, Button, TextInputComponent],
  templateUrl: './create-subcategory-dialog.component.html',
  styleUrl: './create-subcategory-dialog.component.scss',
  standalone: true,
})
export class CreateSubcategoryDialogComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() createSubCategoryEmitter = new EventEmitter();

  @Input() isLoading = false;

  @Input() subCategoryFormControl: FormControl;

  onDialogHide() {
    this.subCategoryFormControl.reset();
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }
}
