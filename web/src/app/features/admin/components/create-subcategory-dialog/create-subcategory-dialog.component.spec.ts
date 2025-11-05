import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubcategoryDialogComponent } from './create-subcategory-dialog.component';

describe('CreateSubcategoryDialogComponent', () => {
  let component: CreateSubcategoryDialogComponent;
  let fixture: ComponentFixture<CreateSubcategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubcategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubcategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
