import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyStatConfig } from '../model/easy-stat.model';
import { EasyStat } from './easy-stat';

describe('EasyStat', () => {
  let fixture: ComponentFixture<EasyStat>;
  const el = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);

  const setup = (config: EasyStatConfig) => {
    fixture = TestBed.createComponent(EasyStat);
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyStat] }).compileComponents();
  });

  it('shows the label and the value, numbers included', () => {
    setup({ label: 'Cities listed', value: 69 });
    expect(el('dt')!.textContent).toContain('Cities listed');
    expect(el('dd')!.textContent).toBe('69');
  });

  it('shows the icon and the tooltip when given', () => {
    setup({ label: 'Total', value: '35.12 M', icon: 'groups', hint: '35,120,000' });
    expect(el('dt mat-icon')!.textContent).toContain('groups');
    expect(el('.stat')!.getAttribute('title')).toBe('35,120,000');
  });

  it('is neutral by default and takes the tone that is asked', () => {
    setup({ label: 'A', value: 1 });
    expect(el('.stat')!.classList).toContain('neutral');
    fixture.componentRef.setInput('config', { label: 'A', value: 1, tone: 'danger' });
    fixture.detectChanges();
    expect(el('.stat')!.classList).toContain('danger');
  });
});
