import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  imports: [NgIf, NgClass],
})
export class LoadingSpinnerComponent {
  @Input() show = false;
  @Input() fullScreen = false;
}
