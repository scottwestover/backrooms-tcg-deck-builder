import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { signal } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogStore } from '../../store/dialog.store';
import { dummyCard, emptyDeck } from '../../../models';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

// Mock child components to prevent their dependencies from being instantiated.
@Component({
  selector: 'backrooms-deck-dialog',
  template: '',
  standalone: true,
})
class MockDeckDialogComponent {}

@Component({
  selector: 'backrooms-export-deck-dialog',
  template: '',
  standalone: true,
})
class MockExportDeckDialogComponent {}

@Component({
  selector: 'backrooms-view-card-dialog',
  template: '',
  standalone: true,
})
class MockViewCardDialogComponent {}

@Component({
  selector: 'backrooms-changelog-dialog',
  template: '',
  standalone: true,
})
class MockChangelogDialogComponent {}

@Component({
  selector: 'backrooms-create-challenge-dialog',
  template: '',
  standalone: true,
})
class MockCreateChallengeDialogComponent {}

@Component({
  selector: 'backrooms-my-challenges-dialog',
  template: '',
  standalone: true,
})
class MockMyChallengesDialogComponent {}

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogStoreSpy: jasmine.SpyObj<InstanceType<typeof DialogStore>>;

  const settingsSignal = signal(false);
  const viewCardSignal = signal({ show: false, card: dummyCard, width: '' });
  const exportDeckSignal = signal({ show: false, deck: emptyDeck });
  const deckSignal = signal({ show: false, editable: true, deck: emptyDeck });
  const changelogSignal = signal(false);
  const createChallengeSignal = signal(false);
  const myChallengesSignal = signal(false); // New signal for myChallenges

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj(
      'DialogStore',
      [
        'updateSettingsDialog',
        'showViewCardDialog',
        'showExportDeckDialog',
        'showDeckDialog',
        'updateChangelogDialog',
        'updateCreateChallengeDialog',
        'updateMyChallengesDialog', // Add new method
        'challengeToEdit',
      ],
      {
        settings: settingsSignal,
        viewCard: viewCardSignal,
        exportDeck: exportDeckSignal,
        deck: deckSignal,
        changelog: changelogSignal,
        createChallenge: createChallengeSignal,
        myChallenges: myChallengesSignal, // Add new signal
      },
    );

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        { provide: DialogStore, useValue: storeSpy },
        { provide: ConfirmationService, useValue: {} },
      ],
    })
      .overrideComponent(DialogComponent, {
        set: {
          imports: [
            DialogModule,
            MockDeckDialogComponent,
            MockExportDeckDialogComponent,
            MockViewCardDialogComponent,
            MockChangelogDialogComponent,
            MockCreateChallengeDialogComponent,
            MockMyChallengesDialogComponent, // Add new mock component
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    dialogStoreSpy = TestBed.inject(DialogStore) as jasmine.SpyObj<
      InstanceType<typeof DialogStore>
    >;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('State Synchronization', () => {
    it('should update createChallengeDialog when store signal changes', fakeAsync(() => {
      createChallengeSignal.set(true);
      fixture.detectChanges();
      tick(); // Let the effect run
      expect(component.createChallengeDialog).toBeTrue();
    }));

    it('should update myChallengesDialog when store signal changes', fakeAsync(() => {
      myChallengesSignal.set(true);
      fixture.detectChanges();
      tick(); // Let the effect run
      expect(component.myChallengesDialog).toBeTrue();
    }));
  });

  describe('Close Handlers', () => {
    it('should call updateCreateChallengeDialog on closeCreateChallengeDialog', () => {
      component.closeCreateChallengeDialog();
      expect(dialogStoreSpy.updateCreateChallengeDialog).toHaveBeenCalledWith(
        false,
      );
    });

    it('should call updateMyChallengesDialog on closeMyChallengesDialog', () => {
      component.closeMyChallengesDialog();
      expect(dialogStoreSpy.updateMyChallengesDialog).toHaveBeenCalledWith(
        false,
      );
    });
  });
});
