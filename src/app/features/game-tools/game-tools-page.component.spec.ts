import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GameToolsPageComponent } from './game-tools-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GameToolsPageComponent', () => {
  let component: GameToolsPageComponent;
  let fixture: ComponentFixture<GameToolsPageComponent>;

  beforeEach(async () => {
    // Mock localStorage
    const store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => store[key] || null,
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        store[key] = value;
      },
    );

    // Mock WakeLock
    const mockWakeLock = {
      request: jasmine.createSpy('request').and.returnValue(
        Promise.resolve({
          release: jasmine
            .createSpy('release')
            .and.returnValue(Promise.resolve()),
        }),
      ),
    };
    Object.defineProperty(navigator, 'wakeLock', {
      value: mockWakeLock,
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [GameToolsPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GameToolsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sanity 20', () => {
    expect(component.sanity()).toBe(20);
    expect(component.hasFlipped()).toBeFalse();
  });

  it('should load sanity from localStorage', () => {
    localStorage.setItem('backrooms-sanity', '15');
    // Re-trigger init or call loadSettings
    (component as any).loadSettings();
    expect(component.sanity()).toBe(15);
  });

  describe('Sanity Tracker', () => {
    it('should increment sanity', () => {
      component.sanity.set(10);
      component.updateSanity(1);
      expect(component.sanity()).toBe(11);
    });

    it('should cap sanity at 20', () => {
      component.sanity.set(19);
      component.updateSanity(5);
      expect(component.sanity()).toBe(20);
    });

    it('should not go below 0', () => {
      component.sanity.set(2);
      component.updateSanity(-5);
      expect(component.sanity()).toBe(0);
    });

    it('should save to localStorage when updated', () => {
      component.updateSanity(-5);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'backrooms-sanity',
        '15',
      );
    });
  });

  describe('Coin Flip', () => {
    it('should start spinning and then show result after 1 second', fakeAsync(() => {
      expect(component.isSpinning()).toBeFalse();
      expect(component.hasFlipped()).toBeFalse();

      component.flipCoin();
      expect(component.isSpinning()).toBeTrue();

      tick(1000);
      expect(component.isSpinning()).toBeFalse();
      expect(component.hasFlipped()).toBeTrue();
      expect(['Heads', 'Tails']).toContain(component.coinResult());
    }));
  });

  it('should reset the game', () => {
    component.sanity.set(10);
    component.hasFlipped.set(true);
    component.coinResult.set('Tails');

    component.resetGame();

    expect(component.sanity()).toBe(20);
    expect(component.hasFlipped()).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalledWith('backrooms-sanity', '20');
  });

  it('should request wake lock on init', () => {
    expect((navigator as any).wakeLock.request).toHaveBeenCalledWith('screen');
  });
});
