import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpShareDeckComponent } from './help-share-deck.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HelpShareDeckComponent', () => {
  let component: HelpShareDeckComponent;
  let fixture: ComponentFixture<HelpShareDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpShareDeckComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpShareDeckComponent);
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

    const mobileImage = fixture.debugElement.query(By.css('img[src*="mobile/navigate_to_decklist.gif"]'));
    const desktopImage = fixture.debugElement.query(By.css('img[src*="desktop/navigate_to_decklist.gif"]'));

    expect(mobileImage).withContext('Should show mobile image when isMobile is true').toBeTruthy();
    expect(desktopImage).withContext('Should NOT show desktop image when isMobile is true').toBeNull();

    const iframe = fixture.debugElement.query(By.css('iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.src).toContain('https://www.youtube.com/embed/jYv5hmuYvEI');
  });

  it('should display desktop content when isMobile is false', () => {
    component.isMobile = false;
    fixture.detectChanges();

    const mobileImage = fixture.debugElement.query(By.css('img[src*="mobile/navigate_to_decklist.gif"]'));
    const desktopImage = fixture.debugElement.query(By.css('img[src*="desktop/navigate_to_decklist.gif"]'));

    expect(mobileImage).withContext('Should NOT show mobile image when isMobile is false').toBeNull();
    expect(desktopImage).withContext('Should show desktop image when isMobile is false').toBeTruthy();

    const iframe = fixture.debugElement.query(By.css('iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.src).toContain('https://www.youtube.com/embed/jYv5hmuYvEI');
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
