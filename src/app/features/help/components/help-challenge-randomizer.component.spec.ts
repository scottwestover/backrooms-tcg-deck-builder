import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpChallengeRandomizerComponent } from './help-challenge-randomizer.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HelpChallengeRandomizerComponent', () => {
  let component: HelpChallengeRandomizerComponent;
  let fixture: ComponentFixture<HelpChallengeRandomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpChallengeRandomizerComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpChallengeRandomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct titles for challenge randomizer sections', () => {
    const titles = fixture.debugElement.queryAll(By.css('.how-to-challenge-randomizer-title'));
    expect(titles.length).toBe(5);
    expect(titles[0].nativeElement.textContent).toContain('How To Use the Challenge Randomizer');
    expect(titles[1].nativeElement.textContent).toContain('Challenge Modes Explained');
    expect(titles[2].nativeElement.textContent).toContain('How To Use All Levels Mode');
    expect(titles[3].nativeElement.textContent).toContain('How To Use Random Mode');
    expect(titles[4].nativeElement.textContent).toContain('How To Use Manual Mode');
  });

  it('should display all YouTube iframes with correct attributes', () => {
    const iframes = fixture.debugElement.queryAll(By.css('iframe'));
    expect(iframes.length).toBe(5);

    const expectedSrcs = [
      'https://www.youtube.com/embed/u3Xx92uSxHY',
      'https://www.youtube.com/embed/s6RGKB_pWko',
      'https://www.youtube.com/embed/1XJmouhGbeI',
      'https://www.youtube.com/embed/Uiob96oLvJ0',
      'https://www.youtube.com/embed/DdblVafDLnM',
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
