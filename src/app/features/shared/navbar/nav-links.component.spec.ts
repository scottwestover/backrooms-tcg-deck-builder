import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NavLinksComponent } from './nav-links.component';
import { AuthService } from '../../../services/auth.service';
import { DialogStore } from '../../../store/dialog.store'; // Import DialogStore
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule

describe('NavLinksComponent', () => {
  let component: NavLinksComponent;
  let fixture: ComponentFixture<NavLinksComponent>;
  let router: Router;
  let routerEventsSubject: Subject<any>; // Subject to control router events

  const authServiceStub = {
    userData: null,
    authChange: of(null),
    isLoggedIn: false,
    GoogleAuth: () => {},
    LogOut: () => {},
  };

  const dialogStoreStub = {
    updateSettingsDialog: jasmine.createSpy('updateSettingsDialog'),
    updateChangelogDialog: jasmine.createSpy('updateChangelogDialog'),
  };

  let routerStub: {
    navigateByUrl: jasmine.Spy;
    events: Subject<any>;
    url: string;
  };

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();
    routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      events: routerEventsSubject.asObservable() as any,
      url: '/', // Default URL
    };

    await TestBed.configureTestingModule({
      imports: [NavLinksComponent, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: DialogStore, useValue: dialogStoreStub }, // Provide mock DialogStore
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavLinksComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Manually trigger ngOnInit to subscribe to router events
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getNavigationBorder for /randomizer', () => {
    it('should return active styles when route is exactly "/randomizer"', () => {
      routerStub.url = '/randomizer';
      routerEventsSubject.next(
        new NavigationEnd(1, '/randomizer', '/randomizer'),
      );
      fixture.detectChanges();
      const result = component.getNavigationBorder('/randomizer');
      expect(result['text-[#ffd54f]']).toBe(true);
      expect(result['text-[#e2e4e6]']).toBe(false);
    });

    it('should return active styles when route is "/randomizer" with query params', () => {
      routerStub.url = '/randomizer?rooms=1&items=2';
      routerEventsSubject.next(
        new NavigationEnd(
          1,
          '/randomizer?rooms=1&items=2',
          '/randomizer?rooms=1&items=2',
        ),
      );
      fixture.detectChanges();
      const result = component.getNavigationBorder('/randomizer');
      expect(result['text-[#ffd54f]']).toBe(true);
      expect(result['text-[#e2e4e6]']).toBe(false);
    });

    it('should return inactive styles when route is different', () => {
      routerStub.url = '/home';
      routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));
      fixture.detectChanges();
      const result = component.getNavigationBorder('/randomizer');
      expect(result['text-[#ffd54f]']).toBe(false);
      expect(result['text-[#e2e4e6]']).toBe(true);
    });
  });

  describe('getNavigationBorder for /challenges', () => {
    it('should return active styles when route is exactly "/challenges"', () => {
      routerStub.url = '/challenges';
      routerEventsSubject.next(
        new NavigationEnd(1, '/challenges', '/challenges'),
      );
      fixture.detectChanges();
      const result = component.getNavigationBorder('/challenges');
      expect(result['text-[#ffd54f]']).toBe(true);
      expect(result['text-[#e2e4e6]']).toBe(false);
    });

    it('should return active styles when route is "/challenges" with query params', () => {
      routerStub.url = '/challenges?mode=manual';
      routerEventsSubject.next(
        new NavigationEnd(
          1,
          '/challenges?mode=manual',
          '/challenges?mode=manual',
        ),
      );
      fixture.detectChanges();
      const result = component.getNavigationBorder('/challenges');
      expect(result['text-[#ffd54f]']).toBe(true);
      expect(result['text-[#e2e4e6]']).toBe(false);
    });

    it('should return inactive styles when route is different', () => {
      routerStub.url = '/home';
      routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));
      fixture.detectChanges();
      const result = component.getNavigationBorder('/challenges');
      expect(result['text-[#ffd54f]']).toBe(false);
      expect(result['text-[#e2e4e6]']).toBe(true);
    });
  });
});
