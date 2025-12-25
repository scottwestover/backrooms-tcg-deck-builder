import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpManageCustomChallengesComponent } from './help-manage-custom-challenges.component';
import { ChangeDetectionStrategy } from '@angular/core';

describe('HelpManageCustomChallengesComponent', () => {
  let component: HelpManageCustomChallengesComponent;
  let fixture: ComponentFixture<HelpManageCustomChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpManageCustomChallengesComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpManageCustomChallengesComponent);
    component = fixture.componentInstance;
    // Detach the component from the change detection tree to test OnPush strategy
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the YouTube iframe with the correct src and title', () => {
    const compiled = fixture.nativeElement;
    const iframe: HTMLIFrameElement = compiled.querySelector('iframe');

    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('https://www.youtube.com/embed/qNJNbNR6KxY');
    expect(iframe.title).toBe('YouTube video player');
    expect(iframe.allowFullscreen).toBeTrue();
    expect(iframe.getAttribute('allow')).toBe('accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    expect(iframe.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin');
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
