import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpDeckRandomizerComponent } from './help-deck-randomizer.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HelpDeckRandomizerComponent', () => {
  let component: HelpDeckRandomizerComponent;
  let fixture: ComponentFixture<HelpDeckRandomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpDeckRandomizerComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeckRandomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct titles for deck randomizer sections', () => {
    const titles = fixture.debugElement.queryAll(By.css('.how-to-deck-randomizer-title'));
    expect(titles.length).toBe(5);
    expect(titles[0].nativeElement.textContent).toContain('How To Use the Deck Randomizer');
    expect(titles[1].nativeElement.textContent).toContain('Randomizer Modes Explained');
    expect(titles[2].nativeElement.textContent).toContain('How To Use Simple Mode');
    expect(titles[3].nativeElement.textContent).toContain('How To Use Mixed Mode');
    expect(titles[4].nativeElement.textContent).toContain('How To Use Manual Mode');
  });

  it('should display all YouTube iframes with correct attributes', () => {
    const iframes = fixture.debugElement.queryAll(By.css('iframe'));
    expect(iframes.length).toBe(5);

    const expectedSrcs = [
      'https://www.youtube.com/embed/u4VeVBePcQQ',
      'https://www.youtube.com/embed/C7UZkSnF1Uc',
      'https://www.youtube.com/embed/hhpvAIfNL6o',
      'https://www.youtube.com/embed/jC8YFMaLXyo',
      'https://www.youtube.com/embed/-L5ohVNEFR4',
    ];

    iframes.forEach((iframe, index) => {
      expect(iframe.nativeElement.src).toContain(expectedSrcs[index]);
      expect(iframe.nativeElement.title).toBe('YouTube video player');
      expect(iframe.nativeElement.allowFullscreen).toBeTrue();
      expect(iframe.nativeElement.getAttribute('allow')).toBe('accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      expect(iframe.nativeElement.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin');
    });
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
