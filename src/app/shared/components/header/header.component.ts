import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-header',
  imports: [Image, Button],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent {
  @Input() test = 0;
}
