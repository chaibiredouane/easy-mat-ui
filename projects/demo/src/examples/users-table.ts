import { Component, computed, signal } from '@angular/core';
import {
  ColumnType,
  CRUD,
  EasyDialogInit,
  EasyTableComponent,
  EasyTableConfig,
  EasyTableDialogRequest,
  EasyTableDialogResult,
  MatColumnTyped,
  ToolbarConfig,
  ToolbarTranslations
} from 'easy-mat-ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const { InputType } = MatColumnTyped;

const USERS: User[] = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', active: true },
  { id: 2, name: 'Bob Keller', email: 'bob@example.com', role: 'Editor', active: true },
  { id: 3, name: 'Chloé Dubois', email: 'chloe@example.com', role: 'Viewer', active: false }
];

/** Columns: the order of the array is the order on screen. */
const columns = [
  // Text filter under the title: type to narrow the rows.
  new MatColumnTyped({ name: 'name', translateTitle: 'Name', enableFilter: true, filterType: 'text' }),
  new MatColumnTyped({ name: 'email', translateTitle: 'Email', enableFilter: true, filterType: 'text' }),
  // Multi-select filter (the default): it lists the values found in the column.
  new MatColumnTyped({ name: 'role', translateTitle: 'Role', enableFilter: true }),
  // A boolean as an icon.
  new MatColumnTyped({
    name: 'active',
    translateTitle: 'Active',
    type: ColumnType.ICON,
    enableIcon: 'check_circle',
    disableIcon: 'cancel',
    stickyClass: 'text-center',
    headerClass: 'text-center', // centre the title too
    conditionFn: (user: User) => user.active,
    cssClassFn: (user: User) => (user.active ? 'text-success' : 'text-danger')
  }),
  // View, edit and delete buttons of each row.
  new MatColumnTyped({ name: 'actions', headerIcon: 'rule', stickyClass: 'text-center', headerClass: 'text-center' })
];

/** The form of the dialog: it opens for a new user and for a user to edit or view. */
function userDialog(request: EasyTableDialogRequest<User>): EasyDialogInit<User> {
  return {
    title: 'User',
    titleField: 'name',
    action: request.action,
    data: request.action === CRUD.CREATE ? ({ id: 0, name: '', email: '', role: '', active: true } as User) : request.data,
    fields: [
      new MatColumnTyped({ name: 'name', order: 1, isRequired: true }),
      new MatColumnTyped({ name: 'email', order: 2 }),
      new MatColumnTyped({ name: 'role', order: 3 }),
      new MatColumnTyped({ name: 'active', order: 4, inputType: InputType.Checkbox })
    ],
    withAuditFields: false
  };
}

@Component({
  selector: 'app-users',
  imports: [EasyTableComponent],
  template: `
    <lib-easy-table
      [config]="config()"
      (dialogResult)="onDialogResult($event)"
      (deleteItem)="onDelete($event)" />
  `
})
export class Users {
  readonly users = signal<User[]>(USERS);

  // One configuration object describes the whole table. A new object refreshes it when the data changes.
  readonly config = computed(
    () =>
      new EasyTableConfig<User>({
        appearance: 'outline',
        withToolbar: true, // search field, add and clear buttons
        withFilterInHeader: true, // the column filters
        changePageSize: 10, // rows per page
        sortedBy: '', // keep the order of your data
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        displayedColumns: columns,
        toolbarConfig: new ToolbarConfig({ icon: 'group', translations: new ToolbarTranslations({ title: 'Users' }) }),
        data: this.users(),
        dialog: { add: true, edit: true, view: true, mode: 'open', form: userDialog }
      })
  );

  onDialogResult({ result }: EasyTableDialogResult<User>): void {
    if (result.event !== CRUD.CREATE && result.event !== CRUD.UPDATE) return;
    const saved = result.data as User;
    // Replace these lines with a call to your service when the data comes from an API.
    this.users.update((users) =>
      users.some((user) => user.id === saved.id)
        ? users.map((user) => (user.id === saved.id ? saved : user))
        : [...users, { ...saved, id: Math.max(0, ...users.map((user) => user.id)) + 1 }]
    );
  }

  onDelete(item: object): void {
    const { id } = item as User;
    this.users.update((users) => users.filter((user) => user.id !== id));
  }
}
