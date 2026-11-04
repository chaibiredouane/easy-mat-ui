import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyPageHeaderConfig } from '../model/easy-page-header.model';
import { EasyPageHeader } from './easy-page-header';

@Component({
  imports: [EasyPageHeader],
  template: `<lib-easy-page-header [config]="config"><button id="control">Export</button></lib-easy-page-header>`
})
class Host {
  config: EasyPageHeaderConfig = { icon: 'public', title: 'Countries', subtitle: 'Every country of the world.' };
}

describe('EasyPageHeader', () => {
  let fixture: ComponentFixture<Host>;
  const el = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('shows the icon, the title and the subtitle', () => {
    expect(el('.icon mat-icon')!.textContent).toContain('public');
    expect(el('h2')!.textContent).toBe('Countries');
    expect(el('p')!.textContent).toBe('Every country of the world.');
  });

  it('shows what is placed inside the tag in the controls slot', () => {
    expect(el('.controls #control')).toBeTruthy();
  });

  it('leaves out the icon and the subtitle when they are not given', () => {
    fixture.componentInstance.config = { title: 'Only a title' };
    fixture.detectChanges();
    expect(el('.icon')).toBeNull();
    expect(el('p')).toBeNull();
  });
});
