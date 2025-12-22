import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CreateChallengeDialogComponent } from './create-challenge-dialog.component';
import { ChallengeService } from '../../../services/challenge.service';
import { DialogStore } from '../../../store/dialog.store';
import { MessageService } from 'primeng/api';

describe('CreateChallengeDialogComponent', () => {
  let component: CreateChallengeDialogComponent;
  let fixture: ComponentFixture<CreateChallengeDialogComponent>;
  let challengeServiceSpy: jasmine.SpyObj<ChallengeService>;
  let dialogStoreSpy: jasmine.SpyObj<InstanceType<typeof DialogStore>>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    challengeServiceSpy = jasmine.createSpyObj('ChallengeService', [
      'createChallenge',
    ]);
    dialogStoreSpy = jasmine.createSpyObj('DialogStore', [
      'updateCreateChallengeDialog',
    ]);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        CreateChallengeDialogComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: ChallengeService, useValue: challengeServiceSpy },
        { provide: DialogStore, useValue: dialogStoreSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateChallengeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when form is empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should be valid when all fields are filled', () => {
    component.form.setValue({
      name: 'Test',
      description: 'Test Desc',
      difficulty: 1,
      type: 'Test Type',
    });
    expect(component.form.valid).toBeTruthy();
  });

  describe('submit', () => {
    beforeEach(() => {
      component.form.setValue({
        name: 'Test',
        description: 'Test Desc',
        difficulty: 1,
        type: 'Test Type',
      });
    });

    it('should not submit if form is invalid', () => {
      component.form.controls['name'].setValue('');
      component.submit();
      expect(challengeServiceSpy.createChallenge).not.toHaveBeenCalled();
    });

    it('should show success and close on successful submission', fakeAsync(() => {
      challengeServiceSpy.createChallenge.and.returnValue(of({}));
      component.submit();
      tick();
      expect(challengeServiceSpy.createChallenge).toHaveBeenCalledWith(
        component.form.value,
      );
      expect(dialogStoreSpy.updateCreateChallengeDialog).toHaveBeenCalledWith(
        false,
      );
    }));

    it('should show error on failed submission', fakeAsync(() => {
      const error = new Error('Test Error');
      challengeServiceSpy.createChallenge.and.returnValue(
        throwError(() => error), // Use throwError()
      );

      component.submit();
      tick();

      expect(challengeServiceSpy.createChallenge).toHaveBeenCalled();
      expect(dialogStoreSpy.updateCreateChallengeDialog).not.toHaveBeenCalled();
    }));
  });

  it('should close the dialog when closeDialog is called', () => {
    component.closeDialog();
    expect(dialogStoreSpy.updateCreateChallengeDialog).toHaveBeenCalledWith(
      false,
    );
  });
});
