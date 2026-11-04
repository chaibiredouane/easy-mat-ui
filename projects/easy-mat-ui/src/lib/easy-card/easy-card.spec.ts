import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyCardActionEvent, EasyCardConfig } from '../model/easy-card.model';
import { EasyCard } from './easy-card';

describe('EasyCard', () => {
  let fixture: ComponentFixture<EasyCard>;
  let component: EasyCard;
  const el = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);

  const setup = (config: EasyCardConfig) => {
    fixture = TestBed.createComponent(EasyCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyCard] }).compileComponents();
  });

  it('shows the icon, the title and the description', () => {
    setup({ icon: 'bug_report', title: 'Report a bug', description: 'Open an issue.' });
    expect(el('.icon')!.textContent).toContain('bug_report');
    expect(el('.title')!.textContent).toContain('Report a bug');
    expect(el('.description')!.textContent).toContain('Open an issue.');
    expect(el('article')).toBeTruthy();
    expect(el('.actions')).toBeNull();
  });

  it('leaves out what is not given', () => {
    setup({ title: 'Only a title' });
    expect(el('.icon')).toBeNull();
    expect(el('.description')).toBeNull();
  });

  it('gives the icon the colour of the card', () => {
    setup({ title: 'Colour', icon: 'star', color: '#b45309' });
    expect(el('.card')!.style.getPropertyValue('--c')).toBe('#b45309');
  });

  it('is one button when it is clickable and has no actions, and emits itself', () => {
    const config: EasyCardConfig = { id: 'a', title: 'Click me', clickable: true };
    setup(config);
    const emitted: EasyCardConfig[] = [];
    component.cardClick.subscribe((card) => emitted.push(card));
    expect(el('button.card')).toBeTruthy();
    el('button.card')!.click();
    expect(emitted).toEqual([config]);
  });

  it('is not a button when it has actions, even if it is clickable', () => {
    setup({ title: 'With actions', clickable: true, actions: [{ id: 'go', label: 'Go' }] });
    expect(el('button.card')).toBeNull();
    expect(el('article')).toBeTruthy();
  });

  it('shows buttons for actions without an address and links for actions with one', () => {
    setup({
      title: 'Actions',
      actions: [
        { id: 'edit', label: 'Edit', icon: 'edit', primary: true },
        { id: 'docs', label: 'Docs', href: 'https://example.com', target: '_blank' },
        { id: 'off', label: 'Off', disabled: true }
      ]
    });
    const actions = Array.from(fixture.nativeElement.querySelectorAll('.action')) as HTMLElement[];
    expect(actions.map((a) => a.tagName)).toEqual(['BUTTON', 'A', 'BUTTON']);
    expect(actions[0].classList).toContain('primary');
    expect(actions[1].getAttribute('href')).toBe('https://example.com');
    expect(actions[1].getAttribute('rel')).toBe('noopener noreferrer');
    expect((actions[2] as HTMLButtonElement).disabled).toBeTrue();
  });

  it('emits the card and the action when a button action is used', () => {
    const config: EasyCardConfig = { id: 'c', title: 'Card', actions: [{ id: 'edit', label: 'Edit' }] };
    setup(config);
    const emitted: EasyCardActionEvent[] = [];
    component.actionClick.subscribe((event) => emitted.push(event));
    (el('button.action') as HTMLButtonElement).click();
    expect(emitted).toEqual([{ card: config, action: config.actions![0] }]);
  });
});
