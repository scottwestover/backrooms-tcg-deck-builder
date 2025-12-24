import { Component, effect, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ChangelogDialogComponent } from './dialogs/changelog-dialog.component';
import { CreateChallengeDialogComponent } from './dialogs/create-challenge-dialog.component';
import { DeckDialogComponent } from './dialogs/deck-dialog.component';
import { ExportDeckDialogComponent } from './dialogs/export-deck-dialog.component';
import { ViewCardDialogComponent } from './dialogs/view-card-dialog.component';
import { DialogStore } from '../../store/dialog.store';
import { MyChallengesDialogComponent } from './dialogs/my-challenges-dialog.component';

@Component({
  selector: 'backrooms-dialog',
  template: `
    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      (onHide)="closeDeckDialog()"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <backrooms-deck-dialog></backrooms-deck-dialog>
    </p-dialog>

    <p-dialog
      header="Export Deck"
      [(visible)]="exportDeckDialog"
      (onHide)="closeExportDeckDialog()"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <backrooms-export-deck-dialog></backrooms-export-deck-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="settingsDialog"
      (onHide)="closeSettingsDialog()"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      header="Settings"
      styleClass="background-darker surface-ground w-full h-full max-w-6xl min-h-[500px]">
    </p-dialog>

    <p-dialog
      [(visible)]="viewCardDialog"
      (onHide)="closeViewCardDialog()"
      [showHeader]="false"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="overflow-x-hidden">
      <backrooms-view-card-dialog></backrooms-view-card-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="changelogDialog"
      (onHide)="closeChangelogDialog()"
      header="Changelog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="background-darker surface-ground w-full h-full max-w-6xl min-h-[500px]">
      <backrooms-changelog-dialog></backrooms-changelog-dialog>
    </p-dialog>

    <p-dialog
      [header]="
        dialogStore.challengeToEdit()
          ? 'Edit Challenge'
          : 'Create a New Challenge'
      "
      [(visible)]="createChallengeDialog"
      (onHide)="closeCreateChallengeDialog()"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full max-w-lg"
      [baseZIndex]="10000">
      <backrooms-create-challenge-dialog></backrooms-create-challenge-dialog>
    </p-dialog>

    <p-dialog
      header="My Challenges"
      [(visible)]="myChallengesDialog"
      (onHide)="closeMyChallengesDialog()"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full max-w-7xl"
      [baseZIndex]="10000">
      <backrooms-my-challenges-dialog></backrooms-my-challenges-dialog>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    DialogModule,
    ChangelogDialogComponent,
    ViewCardDialogComponent,
    ExportDeckDialogComponent,
    DeckDialogComponent,
    CreateChallengeDialogComponent,
    MyChallengesDialogComponent,
  ],
})
export class DialogComponent {
  dialogStore = inject(DialogStore);

  settingsDialog = false;
  viewCardDialog = false;
  exportDeckDialog = false;
  deckDialog = false;
  changelogDialog = false;
  createChallengeDialog = false;
  myChallengesDialog = false;

  constructor() {
    effect(() => {
      this.settingsDialog = this.dialogStore.settings();
    });
    effect(() => {
      this.viewCardDialog = this.dialogStore.viewCard().show;
    });
    effect(() => {
      this.exportDeckDialog = this.dialogStore.exportDeck().show;
    });
    effect(() => {
      this.deckDialog = this.dialogStore.deck().show;
    });
    effect(() => {
      this.changelogDialog = this.dialogStore.changelog();
    });
    effect(() => {
      this.createChallengeDialog = this.dialogStore.createChallenge();
    });
    effect(() => {
      this.myChallengesDialog = this.dialogStore.myChallenges();
    });
  }

  public closeSettingsDialog() {
    this.dialogStore.updateSettingsDialog(false);
  }

  public closeViewCardDialog() {
    this.dialogStore.showViewCardDialog(false);
  }

  public closeExportDeckDialog() {
    this.dialogStore.showExportDeckDialog(false);
  }

  public closeDeckDialog() {
    this.dialogStore.showDeckDialog(false);
  }

  public closeChangelogDialog() {
    this.dialogStore.updateChangelogDialog(false);
  }

  public closeCreateChallengeDialog() {
    this.dialogStore.updateCreateChallengeDialog(false);
  }

  public closeMyChallengesDialog() {
    this.dialogStore.updateMyChallengesDialog(false);
  }
}
