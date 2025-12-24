import { TestBed } from '@angular/core/testing';
import { DialogStore } from './dialog.store';
import { dummyCard, emptyDeck, IChallenge } from '../../models';

describe('DialogStore', () => {
  let store: InstanceType<typeof DialogStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogStore],
    });
    store = TestBed.inject(DialogStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have the correct initial state', () => {
    expect(store.changelog()).toBeFalse();
    expect(store.settings()).toBeFalse();
    expect(store.createChallenge()).toBeFalse();
    expect(store.myChallenges()).toBeFalse();
    expect(store.challengeToEdit()).toBeNull();
    expect(store.viewCard().show).toBeFalse();
    expect(store.exportDeck().show).toBeFalse();
    expect(store.deck().show).toBeFalse();
  });

  it('should update changelog dialog state', () => {
    store.updateChangelogDialog(true);
    expect(store.changelog()).toBeTrue();
    store.updateChangelogDialog(false);
    expect(store.changelog()).toBeFalse();
  });

  it('should update settings dialog state', () => {
    store.updateSettingsDialog(true);
    expect(store.settings()).toBeTrue();
    store.updateSettingsDialog(false);
    expect(store.settings()).toBeFalse();
  });

  it('should update createChallenge dialog state', () => {
    store.updateCreateChallengeDialog(true);
    expect(store.createChallenge()).toBeTrue();
    store.updateCreateChallengeDialog(false);
    expect(store.createChallenge()).toBeFalse();
  });

  it('should update myChallenges dialog state', () => {
    store.updateMyChallengesDialog(true);
    expect(store.myChallenges()).toBeTrue();
    store.updateMyChallengesDialog(false);
    expect(store.myChallenges()).toBeFalse();
  });

  it('should update challengeToEdit state', () => {
    const mockChallenge: IChallenge = {
      id: 'testId',
      name: 'Test Challenge',
      description: 'A challenge for testing',
      difficulty: 2,
      type: 'GENERIC',
      creator: 'Test User',
      userId: 'testUserId',
    };
    store.updateChallengeToEdit(mockChallenge);
    expect(store.challengeToEdit()).toEqual(mockChallenge);

    store.updateChallengeToEdit(null);
    expect(store.challengeToEdit()).toBeNull();
  });

  it('should update viewCard dialog state', () => {
    const newViewCardState = {
      show: true,
      card: { ...dummyCard, id: '123' },
      width: '75vw',
    };
    store.updateViewCardDialog(newViewCardState);
    expect(store.viewCard()).toEqual(newViewCardState);
  });

  it('should update exportDeck dialog state', () => {
    const newExportDeckState = {
      show: true,
      deck: { ...emptyDeck, id: 'deck1' },
    };
    store.updateExportDeckDialog(newExportDeckState);
    expect(store.exportDeck()).toEqual(newExportDeckState);
  });

  it('should update deck dialog state', () => {
    const newDeckState = {
      show: true,
      editable: false,
      deck: { ...emptyDeck, id: 'deck2' },
    };
    store.updateDeckDialog(newDeckState);
    expect(store.deck()).toEqual(newDeckState);
  });

  it('should show/hide viewCard dialog without changing other properties', () => {
    const initialCard = { ...dummyCard, id: 'initial' };
    const initialWidth = '50vw';
    store.updateViewCardDialog({
      show: false,
      card: initialCard,
      width: initialWidth,
    });

    store.showViewCardDialog(true);
    expect(store.viewCard().show).toBeTrue();
    expect(store.viewCard().card).toEqual(initialCard);
    expect(store.viewCard().width).toEqual(initialWidth);

    store.showViewCardDialog(false);
    expect(store.viewCard().show).toBeFalse();
    expect(store.viewCard().card).toEqual(initialCard);
    expect(store.viewCard().width).toEqual(initialWidth);
  });

  it('should show/hide exportDeck dialog without changing other properties', () => {
    const initialDeck = { ...emptyDeck, id: 'initialDeck' };
    store.updateExportDeckDialog({ show: false, deck: initialDeck });

    store.showExportDeckDialog(true);
    expect(store.exportDeck().show).toBeTrue();
    expect(store.exportDeck().deck).toEqual(initialDeck);

    store.showExportDeckDialog(false);
    expect(store.exportDeck().show).toBeFalse();
    expect(store.exportDeck().deck).toEqual(initialDeck);
  });

  it('should show/hide deck dialog without changing other properties', () => {
    const initialDeck = { ...emptyDeck, id: 'initialDeck2' };
    const initialEditable = true;
    store.updateDeckDialog({
      show: false,
      editable: initialEditable,
      deck: initialDeck,
    });

    store.showDeckDialog(true);
    expect(store.deck().show).toBeTrue();
    expect(store.deck().editable).toBe(initialEditable);
    expect(store.deck().deck).toEqual(initialDeck);

    store.showDeckDialog(false);
    expect(store.deck().show).toBeFalse();
    expect(store.deck().editable).toBe(initialEditable);
    expect(store.deck().deck).toEqual(initialDeck);
  });
});
