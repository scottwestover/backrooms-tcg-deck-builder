import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import * as uuid from 'uuid';

import {
  emptyDeck,
  IDeck,
  IDeckCard,
  ITournamentDeck,
} from '../../../../models';
import { mapToDeckCards, setDeckImage } from '../../../functions';
import { AuthService } from '../../../services/auth.service';
import { BackroomsBackendService } from '../../../services/backrooms-backend.service';
import { DialogStore } from '../../../store/dialog.store';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { SaveStore } from '../../../store/save.store';
import { WebsiteStore } from '../../../store/website.store';
import { DeckCardComponent } from '../deck-card.component';
import { ColorSpreadComponent } from '../statistics/color-spread.component';
import { DdtoSpreadComponent } from '../statistics/ddto-spread.component';
import { DOMAIN } from 'src/app/config';

export interface BackroomsCardImage {
  name: string;
  value: string;
}

@Component({
  selector: 'backrooms-deck-dialog',
  template: `
    <div class="flex h-full w-full flex-col">
      <div
        class="grid max-h-[375px] min-h-[200px] w-full grid-cols-4 overflow-y-scroll border-2 border-slate-200 md:grid-cols-6 lg:grid-cols-8">
        <backrooms-deck-card
          *ngFor="let card of mainDeck"
          [edit]="false"
          [card]="card"></backrooms-deck-card>
      </div>

      <div
        class="surface-card mx-auto my-1 flex max-h-[200px] w-full flex-row border border-white">
        <backrooms-ddto-spread
          [deck]="deck"
          [container]="true"
          class="ml-auto hidden border-r border-slate-200 px-5 lg:block"></backrooms-ddto-spread>

        <backrooms-color-spread
          [deck]="deck"
          [container]="true"
          class="mr-auto hidden border-l border-slate-200 px-5 lg:block"></backrooms-color-spread>
      </div>

      <div
        *ngIf="!editable; else edit"
        class="mx-auto my-1 grid grid-cols-3 gap-y-1">
        <label>Title</label>
        <div
          [pTooltip]="deck.title"
          tooltipPosition="top"
          class="text-shadow col-span-2 mr-3 truncate text-3xl font-black text-[#e2e4e6]">
          {{ deck.title }}
        </div>

        <label>Description</label>
        <div class="col-span-2">{{ deck.description }}</div>

        <label>User</label>
        <div class="col-span-2">
          {{ deck.user }}
        </div>
      </div>
      <ng-template #edit [formGroup]="deckFormGroup">
        <div class="mx-auto my-1 grid grid-cols-3 gap-y-1">
          <label>Title</label>
          <input
            formControlName="title"
            placeholder="Deck Name:"
            class="col-span-2 mr-2 w-full text-sm"
            pInputText
            type="text" />
          <label>Image</label>
          <p-dropdown
            styleClass="truncate w-full lg:w-[250px]"
            class=" col-span-2"
            [options]="cardImageOptions"
            formControlName="cardImage"
            optionLabel="name"
            appendTo="body"></p-dropdown>
          <label>Description</label>
          <textarea
            formControlName="description"
            placeholder="Description:"
            class="col-span-2 h-[66px] w-full overflow-hidden"
            pInputTextarea></textarea>
        </div>
      </ng-template>

      <div
        *ngIf="editable; else editButtons"
        class="mx-auto mt-1 grid grid-cols-3">
        <button
          (click)="saveDeck()"
          [disabled]="!deckFormGroup.dirty"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Save"></button>
        <button
          (click)="openDeck($event)"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Open"></button>
        <button
          (click)="copyDeck($event)"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Copy"></button>
        <button
          (click)="showExportDeckDialog()"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Export"></button>
        <button
          (click)="getLink()"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Get Link"></button>
        <button
          (click)="deleteDeck($event)"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Delete"></button>
      </div>
      <ng-template #editButtons>
        <div class="mx-auto mt-1 grid grid-cols-3 lg:grid-cols-5">
          <button
            (click)="openDeck($event)"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Open"></button>
          <button
            (click)="copyDeck($event)"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Copy"></button>
          <button
            (click)="showExportDeckDialog()"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Export"></button>
          <button
            (click)="getLink()"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Get Link"></button>
        </div>
      </ng-template>
    </div>

    <p-confirmDialog
      header="Open Deck"
      rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
    <p-confirmDialog
      header="Delete Confirmation"
      icon="pi pi-exclamation-triangle"
      key="Delete"
      rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
  `,
  standalone: true,
  imports: [
    NgFor,
    DeckCardComponent,
    DdtoSpreadComponent,
    ColorSpreadComponent,
    NgIf,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService],
})
export class DeckDialogComponent {
  changeDetection = inject(ChangeDetectorRef);

  saveStore = inject(SaveStore);
  websiteStore = inject(WebsiteStore);
  dialogStore = inject(DialogStore);
  backroomsCardStore = inject(BackroomsCardStore);

  deck: IDeck | ITournamentDeck = emptyDeck;
  editable = true;

  deckFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    cardImage: new UntypedFormControl({
      name: 'LL-001 - Hallway',
      value: 'LL-001',
    }),
  });

  cardImageOptions: BackroomsCardImage[] = [];

  mainDeck: IDeckCard[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    // private backroomsBackendService: BackroomsBackendService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    effect(() => {
      this.deck = this.dialogStore.deck().deck;
      this.editable = this.dialogStore.deck().editable;

      this.mainDeck = mapToDeckCards(
        this.deck.cards,
        this.backroomsCardStore.cards(),
      );

      this.deckFormGroup = new UntypedFormGroup({
        title: new UntypedFormControl(this.deck.title),
        description: new UntypedFormControl(this.deck.description),
        cardImage: new UntypedFormControl(
          this.getCardImage(this.deck.imageCardId),
        ),
      });

      this.cardImageOptions = this.createImageOptions();

      this.changeDetection.detectChanges();
    });
  }

  openDeck(event: Event) {
    if (this.editable) {
      if (this.authService.isLoggedIn) {
        this.router.navigateByUrl(
          `deckbuilder/user/${this.authService.userData?.uid}/deck/${this.deck.id}`,
        );
      } else {
        this.websiteStore.updateDeck(this.deck);
        this.router.navigateByUrl('deckbuilder');
      }
      this.dialogStore.showDeckDialog(false);
    } else {
      // this.confirmationService.confirm({
      //   target: event.target ?? undefined,
      //   message: 'You are about to open this deck. Are you sure?',
      //   accept: () => {
      //     this.websiteStore.updateDeck(this.deck);
      //     this.router.navigateByUrl(
      //       '/deckbuilder/user/' + this.deck.userId + '/deck/' + this.deck.id,
      //     );
      //     this.dialogStore.showDeckDialog(false);
      //   },
      // });
    }
  }

  deleteDeck(event: Event) {
    if (this.editable) {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        key: 'Delete',
        message: 'You are about to permanently delete this deck. Are you sure?',
        accept: () => {
          this.saveStore.deleteDeck(this.deck);
          this.messageService.add({
            severity: 'success',
            summary: 'Deck deleted!',
            detail: 'Deck was deleted successfully!',
          });
          this.dialogStore.showDeckDialog(false);
        },
      });
    } else {
      // this.confirmationService.confirm({
      //   target: event.target ?? undefined,
      //   key: 'Delete',
      //   message: 'You are about to permanently delete this deck. Are you sure?',
      //   accept: () => {
      //     this.backroomsBackendService
      //       .deleteDeck(this.deck.id)
      //       .pipe(first())
      //       .subscribe();
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Deck deleted!',
      //       detail: 'Deck was deleted successfully!',
      //     });
      //     this.dialogStore.showDeckDialog(false);
      //   },
      // });
    }
  }

  copyDeck(event: Event) {
    this.confirmationService.confirm({
      target: event.target ?? undefined,
      message: 'You are about to copy this deck. Are you sure?',
      accept: () => {
        this.saveStore.importDeck({ ...this.deck, id: uuid.v4() });
        this.messageService.add({
          severity: 'success',
          summary: 'Deck copied!',
          detail: 'Deck was copied successfully!',
        });
        this.dialogStore.showDeckDialog(false);
      },
    });
  }

  showExportDeckDialog() {
    this.dialogStore.updateExportDeckDialog({ show: true, deck: this.deck });
  }

  createImageOptions(): BackroomsCardImage[] {
    return (
      this.mainDeck.map((card) => ({
        name: `${card.id} - ${card.name.english}`,
        value: card.id,
      })) ?? []
    );
  }

  getLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.editable
      ? `${DOMAIN}/deckbuilder/user/${this.authService.userData?.uid}/deck/${this.deck.id}`
      : `${DOMAIN}/deckbuilder/${this.deck.id}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.messageService.add({
      severity: 'success',
      summary: 'Deck-Link saved!',
      detail: 'The deck-link was saved to your clipboard!',
    });
  }

  saveDeck() {
    const deck: IDeck = {
      ...this.deck,
      title: this.deckFormGroup.get('title')?.value,
      description: this.deckFormGroup.get('description')?.value,
      imageCardId: this.deckFormGroup.get('cardImage')?.value.value,
    };

    this.saveStore.saveDeck(deck);
    this.messageService.add({
      severity: 'success',
      summary: 'Deck saved!',
      detail: 'The deck was saved successfully!',
    });
    this.dialogStore.showDeckDialog(false);
  }

  private getCardImage(imageCardId: string): BackroomsCardImage {
    if (!this.deck.cards || this.deck.cards.length === 0) {
      return { name: 'BT1-001 - Yokomon', value: 'BT1-001' };
    }

    let foundCard = this.backroomsCardStore.cardsMap().get(imageCardId);
    if (foundCard) {
      return {
        name: `${foundCard!.id} - ${foundCard!.name}`,
        value: foundCard!.id,
      };
    } else {
      const imageCard = setDeckImage(
        this.deck,
        this.backroomsCardStore.cards(),
      );
      return {
        name: `${imageCard!.id} - ${imageCard!.name}`,
        value: imageCard!.id,
      };
    }
  }
}
