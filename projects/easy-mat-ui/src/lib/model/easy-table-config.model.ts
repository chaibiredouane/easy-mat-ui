import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatColumnTyped } from './mat-column-typed.model';
import { Dictionary } from './dictionary.model';
import { ToolbarConfig } from './toolbar-config.model';
import {MatTableDataSource} from '@angular/material/table';
import {EasyTableDialogConfig} from './easy-table-dialog.model';

export class EasyTableConfig<T = any> {
  dataSource?: MatTableDataSource<T>;
  displayedColumns?: (string | MatColumnTyped)[];
  data!: any[];
  source: string = '';
  btnSize: string = 'btn-small';
  sortedBy: string = 'id';
  readonly: boolean = false;
  withGlobalFilter: boolean = true;
  withTitle: boolean = true;
  logout: boolean = false;
  fontSize: string = '';
  customActionEnable: boolean = false;
  customActionIcon?: string;
  customActionTitle?: string;
  customActionClass?: string;
  icon?: string;
  changePageSize: number = 5;
  isPreview: boolean = false;
  shortHeader: boolean = false;
  canAccess: boolean = false;
  canCreate: boolean = false;
  canUpdate: boolean = false;
  canExport: boolean = false;
  canDelete: boolean = false;
  canImport: boolean = false;
  canConfiguration: boolean = false;
  canAudit: boolean = false;
  canOwner: boolean = false;
  canManage: boolean = false;
  canOrder: boolean = false;
  editAction: boolean = true;
  deleteAction: boolean = true;
  confirmDelete: boolean = true;
  previewAction: boolean = true;
  withHeader: boolean = true;
  clickableIcon: boolean = true;
  withFieldClick: boolean = false;
  titleIcon: string = '';
  customRowActionEnable: boolean = false;
  customRowActionIcon: string = '';
  customRowActionTitle: string = '';
  customRowActionClass: string = 'bg-blue';
  prefix: string = '';
  iconClass: string = 'taupe';
  withToolbar: boolean = true;
  withFilterInHeader: boolean = false;
  expandableGroups: boolean = false;
  toolbarConfig: ToolbarConfig = new ToolbarConfig();
  filterColumn?: MatColumnTyped;
  customColumnFilter: Dictionary[] = [];
  highlightChangedCells: boolean = false;
  canAuditTrail: boolean = false;
  appearance: MatFormFieldAppearance | 'none' = 'outline';
  userFilters: any = { filters: '' };
  isExpanded: boolean = false;
  /** Property that identifies a row (selection highlight). Rows without it are compared by reference. */
  rowKey: string = 'id';
  extendableColumnCheck?: string;
  expandedIcon: string = 'addchart';
  dialog?: EasyTableDialogConfig;
  tabTitle?: string;
  tabIcon?: string;

  constructor(init?: Partial<EasyTableConfig>) {
    Object.assign(this, init);
  }
}
