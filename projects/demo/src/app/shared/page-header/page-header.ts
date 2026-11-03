import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Title block of a demo page: icon, title, one-line explanation, and a slot for page controls. */
@Component({
  selector: 'app-page-header',
  imports: [MatIconModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  icon = input.required<string>();
  title = input.required<string>();
  subtitle = input<string>('');
}
