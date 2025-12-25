import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpCreateDeckComponent } from './help-create-deck.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HelpCreateDeckComponent', () => {
  let component: HelpCreateDeckComponent;
  let fixture: ComponentFixture<HelpCreateDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpCreateDeckComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpCreateDeckComponent);
    component = fixture.componentInstance;
    // Note: fixture.detectChanges() is not called here.
    // Each test will call it to control its own render cycle.
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display mobile content when isMobile is true', () => {
    component.isMobile = true;
    fixture.detectChanges();

    const mobileImage = fixture.debugElement.query(
      By.css('img[src*="mobile/navigate_to_deckbuilder.gif"]')
    );
    const desktopImage = fixture.debugElement.query(
      By.css('img[src*="desktop/navigate_to_deckbuilder.gif"]')
    );

    expect(mobileImage)
      .withContext('Should show mobile image when isMobile is true')
      .toBeTruthy();
    expect(desktopImage)
      .withContext('Should NOT show desktop image when isMobile is true')
      .toBeNull();
  });

  it('should display desktop content when isMobile is false', () => {
    component.isMobile = false;
    fixture.detectChanges();

    const mobileImage = fixture.debugElement.query(
      By.css('img[src*="mobile/navigate_to_deckbuilder.gif"]')
    );
    const desktopImage = fixture.debugElement.query(
      By.css('img[src*="desktop/navigate_to_deckbuilder.gif"]')
    );

    expect(mobileImage)
      .withContext('Should NOT show mobile image when isMobile is false')
      .toBeNull();
    expect(desktopImage)
      .withContext('Should show desktop image when isMobile is false')
      .toBeTruthy();
  });

  it('should have router links to /deckbuilder', () => {
    component.isMobile = true;
    fixture.detectChanges();
    let routerLinks = fixture.debugElement.queryAll(
      By.css('a[routerLink="/deckbuilder"]')
    );
    expect(routerLinks.length).toBeGreaterThan(0);
    expect(routerLinks[0].nativeElement.textContent).toContain('Deckbuilder');

    component.isMobile = false;
    fixture.detectChanges();
    routerLinks = fixture.debugElement.queryAll(
      By.css('a[routerLink="/deckbuilder"]')
    );
    expect(routerLinks.length).toBeGreaterThan(0);
    expect(routerLinks[0].nativeElement.textContent).toContain('Deckbuilder');
  });

  it('should set isMobile input correctly', () => {
    component.isMobile = true;
    fixture.detectChanges();
    expect(component.isMobile).toBeTrue();

    component.isMobile = false;
    fixture.detectChanges();
    expect(component.isMobile).toBeFalse();
  });
});
