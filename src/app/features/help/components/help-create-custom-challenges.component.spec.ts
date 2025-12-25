import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpCreateCustomChallengesComponent } from './help-create-custom-challenges.component';

describe('HelpCreateCustomChallengesComponent', () => {
  let component: HelpCreateCustomChallengesComponent;
  let fixture: ComponentFixture<HelpCreateCustomChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpCreateCustomChallengesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpCreateCustomChallengesComponent);
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
    expect(iframe.src).toContain('https://www.youtube.com/embed/sWZSYasjP98');
    expect(iframe.title).toBe('YouTube video player');
    expect(iframe.allowFullscreen).toBeTrue();
    expect(iframe.getAttribute('allow')).toBe(
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    );
    expect(iframe.getAttribute('referrerpolicy')).toBe(
      'strict-origin-when-cross-origin',
    );
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
