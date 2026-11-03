import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-overview',
  imports: [MatIconModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  /** Asks the shell to open another page. */
  readonly open = output<string>();

  readonly steps = [
    { icon: 'tune', title: 'Describe', text: 'Columns, dialog fields, filters, actions and child tables go in one configuration file.' },
    { icon: 'widgets', title: 'Drop in', text: 'One component in the template: <lib-easy-table [config]="config">.' },
    { icon: 'bolt', title: 'Done', text: 'Search, sorting, pagination, dialogs, expandable rows, tabs, themes and i18n are handled by the library.' }
  ];

  readonly install = 'npm install easy-mat-ui-ng20';

  readonly config = [
    'export const countryTable = (data: Country[]) =>',
    '  new EasyTableConfig<Country>({',
    '    data,',
    '    displayedColumns: [',
    "      new MatColumnTyped({ name: 'name' }),",
    "      new MatColumnTyped({ name: 'capital' }),",
    '    ],',
    '    canCreate: true, canUpdate: true, canDelete: true,',
    "    dialog: { add: true, edit: true, view: true, mode: 'open', form: countryDialogForm },",
    '  });'
  ].join('\n');

  readonly template = '<lib-easy-table [config]="tableConfig" (dialogResult)="onDialogResult($event)" />';

  readonly pages = [
    { id: 'countries', icon: 'public', title: 'Countries and cities', text: 'Every country, expandable rows, a child table.' },
    { id: 'tabs', icon: 'tab', title: 'Child tables in tabs', text: 'Several child tables, one tab each.' },
    { id: 'cities', icon: 'map', title: 'Cities of any country', text: 'The full table: filters, flags, status icons, dialogs.' }
  ];

  readonly compatibility = [
    { angular: '20', status: 'ok', label: 'Supported', note: 'Peer range ^20.0.0.' },
    { angular: '19, 21', status: 'warn', label: 'Works, not official', note: 'Builds and runs; install with --legacy-peer-deps.' },
    { angular: '18', status: 'no', label: 'Does not work', note: 'The table fails at runtime with Material 18.' },
    { angular: '16, 17', status: 'no', label: 'Does not work', note: 'The build fails (needs @let, Angular 18.1+).' }
  ];
}
