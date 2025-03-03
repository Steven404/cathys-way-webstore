import { Component } from '@angular/core';

import { WelcomeBoxComponent } from '../../components/welcome-box/welcome-box.component';

@Component({
  selector: 'app-home',
  imports: [WelcomeBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {}
