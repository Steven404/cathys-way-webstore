import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { Category, ProductColour, SubCategory } from '../../../../core/types';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { newProductFormGroup } from '../../constants';

@Component({
  selector: 'app-create-product-dialog',
  imports: [
    Button,
    Dialog,
    TextInputComponent,
    Select,
    FormsModule,
    ReactiveFormsModule,
    Textarea,
    InputText,
    NgIf,
    NgFor,
    ColorPickerDirective,
  ],
  templateUrl: './create-product-dialog.component.html',
  standalone: true,
  styleUrl: './create-product-dialog.component.scss',
})
export class CreateProductDialogComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Input() categories: Category[] = [];
  @Input() subCategories: SubCategory[] = [];

  @Output() coloursEmitter = new EventEmitter();
  @Output() createProductEmitter = new EventEmitter();

  @Input() isLoading = false;

  @Input() productForm: typeof newProductFormGroup;

  color = '#FFD700';

  colourForm: FormControl = new FormControl('');
  newProductColours: ProductColour[] = [];

  onDialogHide() {
    this.newProductColours = [];
    this.coloursEmitter.emit([]);
    this.productForm.reset();
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  getFormControlErrorMessage(control: FormControl): string {
    if (!control.errors) {
      return '';
    }

    return Object.values(control.errors)[0];
  }

  addNewColour() {
    const newColourName = this.colourForm.value;
    if (!newColourName) {
      return;
    }
    this.newProductColours.push({
      name: newColourName,
      hexCode: this.color,
    });
  }

  removeColour(colour: ProductColour) {
    const colourIndex = this.newProductColours.findIndex(
      (c) => c.hexCode === colour.hexCode,
    );
    this.newProductColours.splice(colourIndex, 1);
  }

  createProduct() {
    this.coloursEmitter.emit(this.newProductColours);
    this.createProductEmitter.emit();
  }

  protected readonly newProductFormGroup = newProductFormGroup;
  protected readonly Object = Object;
}
