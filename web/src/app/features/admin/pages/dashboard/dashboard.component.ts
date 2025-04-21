import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import { CustomError } from '../../../../core/types';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [ToolbarComponent, Dialog, TextInputComponent, Button],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  categoryService = inject(CategoryService);

  isLoading = false;

  addSubCategoryDialogVisible = false;

  subCategoryError = '';

  subCategoryFormControl = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });

  constructor(private messageService: MessageService) {}

  async createSubCategory() {
    const subCategoryName = this.subCategoryFormControl.value;
    this.isLoading = true;
    try {
      await this.categoryService.createSubcategory(subCategoryName, '');
      this.messageService.add({
        key: 'global-toast',
        severity: 'success',
        summary: 'Επιτυχία',
        detail: `Η καταχώριση της υποκατηγορίας "${subCategoryName}" πραγματοποιήθηκε με επιτυχία`,
        life: 5000,
      });
      this.addSubCategoryDialogVisible = false;
      this.subCategoryFormControl.reset();
    } catch (e) {
      const error = e as CustomError;
      console.log(error);
      if (error?.code && error.code === 'already-exists') {
        this.messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Σφάλμα',
          detail: `Υπάρχει ήδη υποκατηγορία με ονομασία "${subCategoryName}"`,
          life: 5000,
        });
      }
    }
    this.isLoading = false;
  }
}
