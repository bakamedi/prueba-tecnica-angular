import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/products.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  public productService = inject(ProductService);

  productForm!: FormGroup;
  public showErrorModal = signal(false);

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10),],],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100),],],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200),],],
      logo: ['', Validators.required],
      dateRelease: ['', [Validators.required, this.dateReleaseValidator]],
      dateRevision: ['', [Validators.required, this.dateRevisionValidator.bind(this)]],
    });
  }


  dateReleaseValidator(control: AbstractControl): ValidationErrors | null {
    const dateRelease = new Date(control.value);
    const today = new Date();
    if (dateRelease < today) {
      return { dateReleaseInvalid: true };
    }
    return null;
  }

  dateRevisionValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.productForm || !this.productForm.get('dateRelease')) {
      return null;
    }

    const dateReleaseControl = this.productForm.get('dateRelease');
    const dateRelease = new Date(dateReleaseControl?.value);
    const dateRevision = new Date(control.value);

    const oneYearLater = new Date(dateRelease);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (dateRevision.getTime() !== oneYearLater.getTime()) {
      return { dateRevisionInvalid: true };
    }
    return null;
  }

  resetForm(): void {
    this.productForm.reset();
  }


  public async onSubmit() {
    if (this.productForm.get('id')?.valid) {
      const result = await this.productService.verifyIdentifier(this.productForm.get('id')?.value);
      if (!result) {
        this.showErrorModal.update(value => !result);

        const product = {
          id: this.productForm.get('id')?.value,
          name: this.productForm.get('name')?.value,
          description: this.productForm.get('description')?.value,
          logo: this.productForm.get('logo')?.value,
          date_release: this.productForm.get('dateRelease')?.value,
          date_revision: this.productForm.get('dateRevision')?.value
        };

        const result2 = await this.productService.createItem(product);
        if (result2) {
         await this.productService.loadProducts();
          this.productService.paginateProducts(1);
          this.resetForm();
        }
      }
    }
    if (this.productForm.valid) {
      console.log(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

}
