import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EasyStatConfig } from '../model/easy-stat.model';

/** A key figure: a small label above a large value, with an optional icon and tooltip. Put several side by side with flex or grid. */
@Component({
  selector: 'lib-easy-stat',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './easy-stat.html',
  styleUrls: ['./easy-stat.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyStat {
  @Input({ required: true }) config!: EasyStatConfig;
}
