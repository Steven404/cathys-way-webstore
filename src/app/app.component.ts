import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Image } from 'primeng/image';

import { HeaderComponent } from './shared/components/header/header.component';
import { WelcomeBoxComponent } from './welcome-box/welcome-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Image, WelcomeBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cathys-way-webstore';
}
