import { Component } from '@angular/core';

import { HeaderComponent } from './shared/components/header/header.component';
import { WelcomeBoxComponent } from './welcome-box/welcome-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, WelcomeBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cathys-way-webstore';
}
