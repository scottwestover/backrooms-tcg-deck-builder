import { NgClass, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid';
import { BackroomsCard, IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions';
import { AuthService } from '../../../services/auth.service';
import { DialogStore } from '../../../store/dialog.store';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { ExportDeckDialogComponent } from '../../shared/dialogs/export-deck-dialog.component';
import { ImportDeckDialogComponent } from '../../shared/dialogs/import-deck-dialog.component';

@Component({
  selector: 'backrooms-deck-toolbar',
  template: `
    <div
      class="toolbar ml-3 mr-3 flex w-[100%-3rem] flex-row justify-evenly border-b-2 border-slate-600 md:grid-cols-12">
      <button
        (click)="missingCardsChange.emit(!missingCards)"
        class="p-button-outlined h-[30px] w-full"
        [ngClass]="{ 'primary-background-custom': missingCards }"
        icon="pi pi-times"
        iconPos="left"
        pButton
        pTooltip="Click to show what cards are missing from your Collection!"
        tooltipPosition="top"></button>

      <button
        (click)="newDeck()"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-file"
        iconPos="left"
        pButton
        pTooltip="Click to create a new Deck!"
        tooltipPosition="top"></button>

      <button
        (click)="save.emit($event)"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-save"
        iconPos="left"
        pTooltip="Click to save your Deck!"
        pButton></button>

      <button
        (click)="importDeckDialog = true"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-download"
        iconPos="left"
        pButton
        pTooltip="Click to import a deck!"
        tooltipPosition="top"></button>

      <button
        (click)="openExportDeckDialog()"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-upload"
        iconPos="left"
        pButton
        pTooltip="Click to export this deck!"
        tooltipPosition="top"></button>

      <button
        (click)="hideStats.emit(true)"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-chart-bar"
        iconPos="left"
        pButton
        pTooltip="Click to hide/show deck statistics!"
        tooltipPosition="top"></button>
    </div>

    <p-dialog
      header="Import Deck"
      [(visible)]="importDeckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false">
      <backrooms-import-deck-dialog
        (onClose)="importDeckDialog = false"></backrooms-import-deck-dialog>
    </p-dialog>

    <p-confirmDialog
      header="New Deck Confirmation"
      icon="pi pi-file"
      key="NewDeck"
      rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    NgClass,
    DialogModule,
    NgFor,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    ConfirmDialogModule,
  ],
  providers: [MessageService],
})
export class DeckToolbarComponent {
  @Input() missingCards: boolean;

  @Output() missingCardsChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() hideStats = new EventEmitter<boolean>();

  websiteStore = inject(WebsiteStore);
  dialogStore = inject(DialogStore);
  backroomCardStore = inject(BackroomsCardStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() =>
    mapToDeckCards(
      this.websiteStore.deck().cards,
      this.backroomCardStore.cards(),
    ),
  );

  importDeckDialog = false;
  priceCheckDialog = false;
  simulateDialog = false;
  checkPrice$ = new BehaviorSubject(false);

  securityStack: BackroomsCard[];
  drawHand: BackroomsCard[];
  allDeckCards: BackroomsCard[];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: Router,
    private authService: AuthService,
  ) {}

  private static shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  newDeck() {
    this.confirmationService.confirm({
      key: 'NewDeck',
      message:
        'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        const newDeckID = uuid.v4();
        this.websiteStore.createNewDeck(newDeckID);
        if (this.authService.userData?.uid) {
          this.route.navigateByUrl(
            `deckbuilder/user/${this.authService.userData?.uid}/deck/${newDeckID}`,
          );
        } else {
          this.route.navigateByUrl(`deckbuilder`);
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Deck cleared!',
          detail: 'Deck-Cards were cleared successfully!',
        });
      },
    });
  }

  //region Simulate Card Draw and Security Stack
  simulate() {
    this.simulateDialog = true;
    this.mulligan();
  }

  mulligan() {
    this.allDeckCards = DeckToolbarComponent.shuffle(
      this.deck().cards.map((card) =>
        this.backroomCardStore.cards().find((a) => a.id === card.id),
      ),
    );
    this.allDeckCards = this.allDeckCards.filter(
      (card) => card.cardType !== 'Digi-Egg',
    );

    this.securityStack = this.allDeckCards.slice(0, 5);
    this.drawHand = this.allDeckCards.slice(5, 10);
  }
  //endregion

  checkPrice() {
    this.priceCheckDialog = true;
    this.checkPrice$.next(true);
  }

  openExportDeckDialog() {
    this.dialogStore.updateExportDeckDialog({ show: true, deck: this.deck() });
  }
}
