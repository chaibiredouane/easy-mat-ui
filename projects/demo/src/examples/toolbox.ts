import { Component, signal } from '@angular/core';
import {
  EasyCardConfig,
  EasyCardGrid,
  EasyChipNav,
  EasyChipNavItem,
  EasyLanguage,
  EasyLanguageSwitch,
  EasyPageHeader,
  EasySegmented,
  EasySegmentedOption,
  EasyStat
} from 'easy-mat-ui-ng20';

/** Six reusable components, each fed by its inputs and reporting by its outputs. No business logic inside. */
@Component({
  selector: 'app-toolbox',
  imports: [EasyPageHeader, EasyStat, EasyChipNav, EasySegmented, EasyLanguageSwitch, EasyCardGrid],
  template: `
    <lib-easy-page-header [config]="{ icon: 'inventory_2', title: 'Warehouse', subtitle: 'Stock by category' }">
      <lib-easy-language-switch [languages]="languages" [selected]="language()" (selectedChange)="language.set($event)" />
    </lib-easy-page-header>

    <lib-easy-stat [config]="{ label: 'Items', value: 1284, icon: 'inventory', tone: 'accent' }" />
    <lib-easy-stat [config]="{ label: 'Low stock', value: 12, tone: 'warning', hint: 'Below the reorder level' }" />

    <lib-easy-chip-nav [items]="categories" [selected]="category()" ariaLabel="Category" (selectedChange)="category.set($event)" />

    <lib-easy-segmented [options]="views" [selected]="view()" ariaLabel="View" (selectedChange)="view.set($event)" />

    <lib-easy-card-grid [items]="cards" [columns]="3" (cardClick)="open($event)" />
  `
})
export class Toolbox {
  // Buttons to browse by category: icon, colour and count are optional.
  readonly categories: EasyChipNavItem[] = [
    { id: 'all', label: 'All', icon: 'apps', count: 1284 },
    { id: 'tools', label: 'Tools', icon: 'build', color: '#b45309', count: 420 },
    { id: 'parts', label: 'Parts', icon: 'settings', color: '#1d4ed8', count: 864 }
  ];
  readonly category = signal('all');

  // A setting or a view: one choice among a few.
  readonly views: EasySegmentedOption[] = [
    { id: 'list', label: 'List', icon: 'view_list' },
    { id: 'grid', label: 'Grid', icon: 'grid_view' }
  ];
  readonly view = signal('list');

  // A language picker that knows nothing about any translation library.
  readonly languages: EasyLanguage[] = [
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'fr', name: 'Français', flag: 'fr' },
    { code: 'ar', name: 'العربية', flag: 'dz' }
  ];
  readonly language = signal('en');

  readonly cards: EasyCardConfig[] = [
    { id: 'receive', icon: 'move_to_inbox', title: 'Receive goods', description: 'Record a delivery.', clickable: true, cta: 'Open' },
    { id: 'count', icon: 'fact_check', title: 'Count stock', description: 'Start an inventory.', clickable: true, cta: 'Open' },
    { id: 'report', icon: 'insights', title: 'Reports', description: 'Stock movements by month.' }
  ];

  open(card: EasyCardConfig): void {
    // card.id tells which card was used.
    console.log(card.id);
  }
}
