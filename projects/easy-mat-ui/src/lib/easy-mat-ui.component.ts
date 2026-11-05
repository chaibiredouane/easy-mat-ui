import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'lib-easy-mat-ui',
  imports: [],
  template: `
    <p>
      easy-mat-ui works!
    </p>
  `,
  standalone: true,
  styles: ``
})
export class EasyMatUiComponent {

}
