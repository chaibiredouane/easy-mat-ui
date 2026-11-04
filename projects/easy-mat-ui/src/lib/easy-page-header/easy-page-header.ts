import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EasyPageHeaderConfig } from '../model/easy-page-header.model';

/** Title block of a page: an icon, a title, a one-line explanation, and a slot (anything inside the tag) for the controls of the page. */
@Component({
  selector: 'lib-easy-page-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './easy-page-header.html',
  styleUrls: ['./easy-page-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyPageHeader {
  @Input({ required: true }) config!: EasyPageHeaderConfig;
}
