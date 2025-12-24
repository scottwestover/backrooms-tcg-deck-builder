import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChallengeManagementSectionComponent } from './challenge-management-section.component';
import { AuthService } from 'src/app/services/auth.service';
import { DialogStore } from 'src/app/store/dialog.store';
import { ToastrModule } from 'ngx-toastr';
import { Subject } from 'rxjs';

describe('ChallengeManagementSectionComponent', () => {
  let component: ChallengeManagementSectionComponent;
  let fixture: ComponentFixture<ChallengeManagementSectionComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogStoreSpy: jasmine.SpyObj<InstanceType<typeof DialogStore>>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['GoogleAuth'], {
      isLoggedIn: false,
      authChange: new Subject<boolean>(),
    });
    dialogStoreSpy = jasmine.createSpyObj('DialogStore', [
      'updateMyChallengesDialog',
      'updateCreateChallengeDialog',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ChallengeManagementSectionComponent,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DialogStore, useValue: dialogStoreSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeManagementSectionComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Logged Out State', () => {
    beforeEach(() => {
      (
        Object.getOwnPropertyDescriptor(authServiceSpy, 'isLoggedIn')
          ?.get as jasmine.Spy
      ).and.returnValue(false);
      fixture.detectChanges();
    });

    it('should show the login prompt when user is logged out', () => {
      const loginPrompt = nativeElement.querySelector('.text-gray-400');
      expect(loginPrompt).toBeTruthy();
      expect(loginPrompt?.textContent).toContain(
        'Want to create your own custom challenges or manage existing ones?',
      );
    });

    it('should not show the management buttons when user is logged out', () => {
      const myChallengesButton = nativeElement.querySelector(
        'p-button[label="My Challenges"]',
      );
      const createChallengeButton = nativeElement.querySelector(
        'p-button[label="Create Challenge"]',
      );
      expect(myChallengesButton).toBeFalsy();
      expect(createChallengeButton).toBeFalsy();
    });

    it('should call authService.GoogleAuth when Login link is clicked', () => {
      const loginLink = nativeElement.querySelector(
        'a.text-yellow-500',
      ) as HTMLAnchorElement;
      loginLink.click();
      expect(authServiceSpy.GoogleAuth).toHaveBeenCalled();
    });
  });

  describe('Logged In State', () => {
    beforeEach(() => {
      (
        Object.getOwnPropertyDescriptor(authServiceSpy, 'isLoggedIn')
          ?.get as jasmine.Spy
      ).and.returnValue(true);
      fixture.detectChanges();
    });

    it('should show the management buttons when user is logged in', () => {
      const myChallengesButton = nativeElement.querySelector(
        'p-button[label="My Challenges"]',
      );
      const createChallengeButton = nativeElement.querySelector(
        'p-button[label="Create Challenge"]',
      );
      expect(myChallengesButton).toBeTruthy();
      expect(createChallengeButton).toBeTruthy();
    });

    it('should not show the login prompt when user is logged in', () => {
      const loginPrompt = nativeElement.querySelector('.text-gray-400');
      expect(loginPrompt).toBeFalsy();
    });

    it('should call updateMyChallengesDialog when "My Challenges" button is clicked', () => {
      const myChallengesButton = nativeElement.querySelector(
        'p-button[label="My Challenges"] button',
      ) as HTMLButtonElement;
      myChallengesButton.click();
      expect(dialogStoreSpy.updateMyChallengesDialog).toHaveBeenCalledWith(
        true,
      );
    });

    it('should call updateCreateChallengeDialog when "Create Challenge" button is clicked', () => {
      const createChallengeButton = nativeElement.querySelector(
        'p-button[label="Create Challenge"] button',
      ) as HTMLButtonElement;
      createChallengeButton.click();
      expect(dialogStoreSpy.updateCreateChallengeDialog).toHaveBeenCalledWith(
        true,
      );
    });
  });
});
